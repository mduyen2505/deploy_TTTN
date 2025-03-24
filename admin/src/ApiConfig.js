const BASE_URL = "http://localhost:3000/api";

export const API_CATEGORY = {
  GET_ALL: `${BASE_URL}/types`,
  ADD: `${BASE_URL}/types`,
  UPDATE: (id) => `${BASE_URL}/types/${id}`,
  DELETE: (id) => `${BASE_URL}/types/${id}`,
};

export const API_SUBCATEGORY = {
    GET_ALL: `${BASE_URL}/subcategories`,
    ADD: `${BASE_URL}/subcategories`,
    UPDATE: (id) => `${BASE_URL}/subcategories/${id}`,
    DELETE: (id) => `${BASE_URL}/subcategories/${id}`,
  };

  export const API_PRODUCT = {
    GET_ALL: `${BASE_URL}/products`,
    ADD: `${BASE_URL}/products`,
    UPDATE: (id) => `${BASE_URL}/products/${id}`,
    DELETE: (id) => `${BASE_URL}/products/${id}`,
  };

  export const API_BRAND = {
    GET_ALL: `${BASE_URL}/brands`,
    ADD: `${BASE_URL}/brands`,
    UPDATE: (id) => `${BASE_URL}/brands/${id}`,
    DELETE: (id) => `${BASE_URL}/brands/${id}`,
  };
  
  

  