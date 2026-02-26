import { Product, getProductsByCategory } from "./products";

const BASE_URL = "https://fakestoreapi.com";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message =
      (await response.text().catch(() => "")) ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return (await response.json()) as T;
}

export async function getProductById(id: number | string): Promise<Product> {
  const response = await fetch(`${BASE_URL}/products/${id}`);
  return handleResponse<Product>(response);
}

export async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  const all = await getProductsByCategory(product.category);
  return all.filter((p) => p.id !== product.id).slice(0, limit);
}

