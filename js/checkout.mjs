import { getCart, cartSubtotal, clearCart } from "./cartStorage.mjs";

const summary = document.querySelector("#checkoutSummary");
const total = document.querySelector("#checkoutTotal");
const message = document.querySelector("#checkoutMessage");
const placeOrderBtn = document.querySelector("#placeOrderBtn");

renderCheckout();

placeOrderBtn.addEventListener("click", () => {
    const cart = getCart();
    
    if (cart.length === 0) {
        setMessage("Your cart is empty.");
        return;
    }

    const order = {
        orderNumber: crypto.randomUUID().slice(0, 8).toUpperCase(),
        items: cart,
        total: cartSubtotal(cart),
        createdAt: new Date().toISOString(),
    };

    sessionStorage.setItem("last_order", JSON.stringify(order));
    clearCart();
    location.href = "confirmation.html";
});

function renderCheckout() {
    const cart = getCart();

    if (cart.length === 0) {
        summary.innerHTML = "";
        total.textContent = "0.00";
        setMessage("Your cart is empty.");
        return;
    }

    setMessage("");

    summary.innerHTML = cart.map((item) => {
        const lineTotal = Number(item.price * item.quantity);

        return `
        <div class="checkout-item">
            <img class="checkout-img" src="${item.image.url}" alt="${escapeHtml(item.image.alt || item.title)}" />

            <div class="checkout-info">
                <h2 class="checkout-title">${escapeHtml(item.title)}</h2>
                <p class="checkout-meta">
                    ${item.size ? `Size: ${item.size} &nbsp;` : ""}
                    Qty: ${item.quantity}
                </p>
            </div>

            <div class="checkout-line-total">${lineTotal.toFixed(2)} €</div>
        </div>
        `;
    })  
    .join("");

    total.textContent = cartSubtotal(cart).toFixed(2);
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