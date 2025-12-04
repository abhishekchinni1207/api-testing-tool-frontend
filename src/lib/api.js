const API_BASE =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function authHeader(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default {
  proxy: async (payload, token) => {
    const res = await fetch(API_BASE + "/proxy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(token),
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  getHistory: async (token) => {
    const res = await fetch(API_BASE + "/history", {
      headers: {
        ...authHeader(token),
      },
    });
    return res.json();
  },

  getCollections: async (token) => {
    const res = await fetch(API_BASE + "/collections", {
      headers: {
        ...authHeader(token),
      },
    });
    return res.json();
  },

  createCollection: async (name, token) => {
    const res = await fetch(API_BASE + "/collections", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(token),
      },
      body: JSON.stringify({ name }),
    });
    return res.json();
  },

  addToCollection: async (collectionId, request, token) => {
    const res = await fetch(`${API_BASE}/collections/${collectionId}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(token),
      },
      body: JSON.stringify({ request }),
    });
    return res.json();
  },

  getCollectionItems: async (id, token) => {
    const res = await fetch(`${API_BASE}/collections/${id}/items`, {
      headers: {
        ...authHeader(token),
      },
    });
    return res.json();
  },

  getEnvs: async (token) => {
    const res = await fetch(API_BASE + "/env", {
      headers: authHeader(token),
    });
    return res.json();
  },

  createEnv: async (env, token) => {
    const res = await fetch(API_BASE + "/env", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(token),
      },
      body: JSON.stringify(env),
    });
    return res.json();
  },

  deleteHistory: async (id, token) => {
    const res = await fetch(`${API_BASE}/history/${id}`, {
      method: "DELETE",
      headers: authHeader(token),
    });
    return res.json();
  },

  deleteCollection: async (id, token) => {
    const res = await fetch(`${API_BASE}/collections/${id}`, {
      method: "DELETE",
      headers: authHeader(token),
    });
    return res.json();
  },

  deleteCollectionItem: async (id, token) => {
    const res = await fetch(`${API_BASE}/collections/items/${id}`, {
      method: "DELETE",
      headers: authHeader(token),
    });
    return res.json();
  },
};
