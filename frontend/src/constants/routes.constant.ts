export const ROUTES = {
  root: "/",
  step: {
    personal: "/step/personal",
    address: "/step/address",
    loan: "/step/loan",
  },
};

const API_BASE = "/api";
export const API_ROUTES = {
  products: {
    categories: `${API_BASE}/products/categories`,
    add: `${API_BASE}/products/add`,
  },
};
