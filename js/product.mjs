import { fetchProductById } from "./api.mjs";
import { addToCart } from "./cartStorage.mjs";

const detail = document.querySelector("#productDetail");
const message = document.querySelector("#productMessage");

init ();

async function init() {
    const id = new URLSearchParams(location.search).get("id");

    if (!id) {
        setMessage("Missing product ID");
        return; 
    }

    setMessage("Loading product...");
    try {
        const product = await fetchProductById(id);
        setMessage("");
        renderProduct(product);
    } catch (err) {
        console.error("fetchProductById failed:", err);
        setMessage(`Sorry - could not load product. ${err.message}`);
    }
}

function renderProduct(p) {
    const price = Number(p.discountedPrice ?? p.price).toFixed(2);
    
    detail.innerHTML = `
        <div class="product-detail-image">
            <img src="${p.image.url}" alt="${escapeHtml(p.image.alt || p.title)}" />
        </div>

        <div class="product-detail-info">
            <h1 class="product-title">${escapeHtml(p.title)}</h1>
            <p class="price">${price} €</p>
            <p class="product-description">${escapeHtml(p.description)}</p>

            <fieldset class="size-selector" id="sizeField">
                <legend>Select Size</legend>
                ${(p.sizes ?? []).map((s) => `
                    <label class="size-option">
                        <input type="radio" name="size" value="${s}" />
                        <span>${s}</span>
                    </label>
                `).join("")}
            </fieldset>

            <button id="addToCartBtn" class="btn btn-primary">Add to cart</button>

            <p id="addedMessage" aria-live="polite"></p>
        </div>
    `;

    const btn = detail.querySelector("#addToCartBtn");
    const addedMessage = detail.querySelector("#addedMessage");

    btn.addEventListener("click", () => {
        const picked = detail.querySelector("input[name='size']:checked")?.value ?? null;

        if ((p.sizes ?? []).length && !picked) {
            setMessage("Please choose a size");
            return;
        }

        addToCart(p, { size: picked });

        setMessage("");
        addedMessage.innerHTML = `
            Product added to cart!
            <a class="btn btn-small" href="cart.html">View Cart</a>
        `;
    });
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