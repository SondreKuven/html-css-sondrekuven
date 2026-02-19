const BASE_URL = "https://v2.api.noroff.dev";
const RAINY_DAYS = "/rainy-days";

export async function fetchAllProducts() {
    const response = await fetch(`${BASE_URL}${RAINY_DAYS}`);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const json = await response.json();
    return json.data;
}

export async function fetchProductById(id) {
    const response = await fetch(`${BASE_URL}${RAINY_DAYS}/${id}`);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const json = await response.json();
    return json.data;
}