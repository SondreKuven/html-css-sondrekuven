import { getCart, removeFromCart, cartSubtotal } from "./cartStorage.mjs";

document.addEventListener("DOMContentLoaded", () => {
    const cartItems = document.querySelector("#cartItems");
    const subtotal = document.querySelector("#cartSubtotal");
    const message = document.querySelector("#cartMessage");

    if (!cartItems || !subtotal || !message) {
        console.error("One or more required elements (#cartItems, #cartSubtotal, #cartMessage) are missing in the DOM.");
        return;
    }

    render();

    function render() {
        const cart = getCart();

        if (cart.length === 0) {
            cartItems.innerHTML = "";
            subtotal.textContent = "0.00";
            setMessage("Your cart is empty.");
            return;
        }

        message.textContent = "";

        cartItems.innerHTML = cart.map((item) => `
            <div class="cart-item">
                <img src="${item.image.url}" alt="${escapeHtml(item.image.alt || item.title)}" />
                <div class="item-info">
                    <p><strong>${escapeHtml(item.title)}</strong></p>
                    <p>
                        ${item.size ? `Size: ${item.size} &nbsp;` : ""}
                        ${Number(item.price).toFixed(2)} &nbsp;
                        Qty: ${item.quantity} &nbsp;
                        <button data-id="${item.id}" data-size="${item.size ?? ""}" aria-label="Remove item">x</button>
                    </p>
                </div>
            </div>
        `).join("");

        subtotal.textContent = cartSubtotal(cart).toFixed(2);

        cartItems.querySelectorAll("button[data-id]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                const size = btn.dataset.size || null;
                removeFromCart(id, size);
                render();
            });
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
});