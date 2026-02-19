import { fetchAllProducts } from "./api.mjs";

const grid = document.querySelector("#productGrid");
const message = document.querySelector("#productMessage");
const genderSelect = document.querySelector("#genderFilter");
const tagSelect = document.querySelector("#tagFilter");
const searchInput = document.querySelector("#searchFilter");
const clearBtn = document.querySelector("#clearFilter");

let allProducts = [];

init();

async function init() {
    setMessage("Loading products...");
    try {
        allProducts = await fetchAllProducts();
        setMessage("");

        populateFilters(allProducts);
        renderProducts(allProducts);
        wireFilters();
    } catch (err) {
        setMessage(`Sorry - could not load products: ${err.message}`);
    }
}

function wireFilters() {
    [genderSelect, tagSelect, searchInput].forEach((el) => {
        el.addEventListener("input", applyFilters);
        el.addEventListener("change", applyFilters);
    });
}

function applyFilters() {
    const gender = genderSelect.value;
    const tag = tagSelect.value;
    const q = searchInput.value.trim().toLowerCase();

    const filtered = allProducts.filter((p) => {
        const matchesGender = !gender || p.gender === gender;
        const matchesTag = !tag || (p.tags ?? []).includes(tag);
        const matchesSearch = 
            !q ||
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q);
            
        return matchesGender && matchesTag && matchesSearch;
    });

    renderProducts(filtered);

    setMessage(`${filtered.length} product(s) found.`);

    if (filtered.length === 0) setMessage("No products match your filters.");
    else setMessage("");
}

function populateFilters(products) {
    const genders = [...new Set(products.map((p) => p.gender).filter(Boolean))];
    const tags = [...new Set(products.flatMap((p) => p.tags ?? []))];

    genders.forEach((g) => genderSelect.add(new Option(g, g)));
    tags.forEach((t) => tagSelect.add(new Option(t, t)));
}

clearBtn.addEventListener("click", () => {
    genderSelect.value = "";
    tagSelect.value = "";
    searchInput.value = "";
    renderProducts(allProducts);
    setMessage("");
});

function renderProducts(products) {
    grid.innerHTML = products
        .map((p) => {
            const price = (p.discountedPrice ?? p.price).toFixed(2);
            return `
                <article class="card product-card">
                    <div class="product-image">
                        <img src="${p.image.url}" alt="${escapeHtml(p.image.alt || p.title)}" />
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${escapeHtml(p.title)}</h3>
                        <p class="price">${price}€</p>
                        <a href="product.html?id=${encodeURIComponent(p.id)}" class="btn btn-small">
                            View products
                        </a>
                    </div>
                </article>
            `;
        })
        .join("");
}

function setMessage(text) {
    message.textContent = text;
}

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
    }[c]));
}