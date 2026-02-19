const CART_KEY = "rainydays_cart_v1";

export function getCart() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(product, { size } = {}) {
    const cart = getCart();
    const existing = cart.find((i) => i.id === product.id && i.size === size);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.discountedPrice ?? product.price,
            image: product.image,
            size: size ?? null,
            quantity: 1,
        });
    }

    saveCart(cart);
    return cart;
}

export function removeFromCart(id, size = null){
    const cart = getCart().filter((i) => !(i.id === id && i.size === size));
    saveCart(cart);
    return cart;
}

export function clearCart() {
    localStorage.removeItem(CART_KEY);
}

export function cartSubtotal( cart = getCart()) {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function updateQuantity(id, size = null, delta = 1) {
    const cart = getCart();
    const item = cart.find((i) => i.id === id && i.size === size);

    if(!item) return cart;

    item.quantity += delta;

    const newCart = cart.filter((i) => i.quantity > 0);
    
    saveCart(newCart);
    return newCart;
}
