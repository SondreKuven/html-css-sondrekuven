const box = document.querySelector("#confirmationBox");
const message = document.querySelector("#confirmationMessage");

renderConfirmation();

function renderConfirmation() {
    const raw = sessionStorage.getItem("last_order");

    if (!raw) {
        box.innerHTML = "";
        message.textContent = "No recent order found.";
        return;
    }

    const order = JSON.parse(raw);

    message.textContent ="";

    box.innerHTML = `
        <h1>Order confirmed!</h1>
        <p><strong>Order number:</strong> ${escapeHtml(order.orderNumber)}</p>
        <p><strong>Order date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
        
        <div class="confirmation-items"> ${order.items.map((item) => `
            <div class="confirmation-item">
                <p><strong>${escapeHtml(item.title)}</strong></p>
                <p>
                    ${item.size ? `Size: ${escapeHtml(item.size)} &nbsp;` : ""}
                    Qty: ${item.quantity} &nbsp;
                    Price:${Number(item.price).toFixed(2)} €
                </p>
            </div>
        `).join("")} 
        </div>

        <p><strong>Total:</strong> ${Number(order.total).toFixed(2)} €</p>
    `;
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