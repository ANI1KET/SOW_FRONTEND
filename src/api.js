const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const login = async (
  email,
  password
) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Login failed");
  }

  return response.json();
};

export const getTexts = async (
  page,
  language
) => {
  const response = await fetch(`${API_BASE_URL}/texts/${page}/${language}`);

  if (!response.ok) {
    throw new Error("Failed to fetch texts");
  }

  return response.json();
};

export const getProducts = async (token) => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
};
