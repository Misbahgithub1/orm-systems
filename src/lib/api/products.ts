export interface Rating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: Rating;
}

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

export async function getCategories(): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/products/categories`);
  return handleResponse<string[]>(response);
}

export async function getAllProducts(): Promise<Product[]> {
  const response = await fetch(`${BASE_URL}/products`);
  return handleResponse<Product[]>(response);
}

export async function getProductsByCategory(
  category: string
): Promise<Product[]> {
  const response = await fetch(
    `${BASE_URL}/products/category/${encodeURIComponent(category)}`
  );

  return handleResponse<Product[]>(response);
}

