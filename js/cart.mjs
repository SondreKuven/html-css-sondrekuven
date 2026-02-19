import { getCart, removeFromCart, cartSubtotal, updateQuantity } from "./cartStorage.mjs";

document.addEventListener("DOMContentLoaded", () => {
    const cartItems = document.querySelector("#cartItems");
    const subtotal = document.querySelector("#cartSubtotal");
    const message = document.querySelector("#cartMessage");

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
                        <button data-action="dec" data-id="${item.id}" data-size="${item.size ?? ""}">-</button>
                        Qty: ${item.quantity} &nbsp;
                        <button data-action="inc" data-id="${item.id}" data-size="${item.size ?? ""}">+</button>
                        <button data-action="remove" data-id="${item.id}" data-size="${item.size ?? ""}" aria-label="Remove item">x</button>
                    </p>
                </div>
            </div>
        `).join("");

        subtotal.textContent = cartSubtotal(cart).toFixed(2);

        cartItems.querySelectorAll("button[data-id]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                const size = btn.dataset.size || null;
                const action = btn.dataset.action;
                
                if (action === "inc") updateQuantity(id, size, 1);
                else if (action === "dec") updateQuantity(id, size, -1);
                else removeFromCart(id, size);
                
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