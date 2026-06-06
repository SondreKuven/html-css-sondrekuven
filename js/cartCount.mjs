import { getCart } from "./cartStorage.mjs";

export function updateCartCount() {
  const countElement = document.querySelector("#cartCount");

  if (!countElement) return;

  const cart = getCart();
  const totalCount = cart.reduce((sum, item) => {
    return sum + (item.quantity || 1);
  }, 0);

  countElement.textContent = totalCount;
  countElement.hidden = totalCount === 0;
}
