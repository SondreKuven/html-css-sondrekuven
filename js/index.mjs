import { fetchAllProducts } from "./api.mjs";

const grid = document.querySelector("#featuredGrid");
const message = document.querySelector("#featuredMessage");

init();

async function init() {
    setMessage("Loading featured products...");

    try {
        const products = await fetchAllProducts();
        const featured = shuffle(products).slice(0, 3);

        setMessage("");
        renderFeatured(featured);
    } catch (err) {
        setMessage(`Sorry - could not load featured products: ${err.message}`);
    }
}

function renderFeatured(products) {
    grid.innerHTML = products.map((p) => {
        const id = p.id ?? p._id;
        const price = Number(p.discountedPrice ?? p.price).toFixed(2);

        return `
            <article class="card product-card">
                <div class="product-image">
                    <img src="${p.image.url}" alt="${escapeHtml(p.image.alt || p.title)}" />
                </div>
                <div class="product-info">
                    <h2 class="product-title">${escapeHtml(p.title)}</h2>
                    <p class="price">${price} €</p>
                    <a href="product/index.html?id=${encodeURIComponent(id)}" class="btn btn-secondary">View details</a>
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

function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr; 
}