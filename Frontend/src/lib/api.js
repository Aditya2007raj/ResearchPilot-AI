const BASE_URL = 'http://localhost:8000/api/v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem('rp_auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleAuthError = (res) => {
  if (res.status === 401) {
    localStorage.removeItem('rp_auth_token');
  }
};

export const api = {
  // --- AUTH ENDPOINTS ---
  register: async ({ full_name, email, password }) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name, email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Registration failed' }));
      throw { response: { data: err } };
    }
    return res.json();
  },

  login: async ({ email, password }) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Login failed' }));
      throw { response: { data: err } };
    }
    return res.json();
  },

  getMe: async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    if (!res.ok) {
      handleAuthError(res);
      const err = await res.json().catch(() => ({ detail: 'Failed to fetch user session' }));
      throw { response: { data: err } };
    }
    return res.json();
  },

  updateProfile: async ({ full_name, bio }) => {
    const res = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ full_name, bio }),
    });
    if (!res.ok) {
      handleAuthError(res);
      const err = await res.json().catch(() => ({ detail: 'Failed to update profile' }));
      throw { response: { data: err } };
    }
    return res.json();
  },

  changePassword: async ({ current_password, new_password }) => {
    const res = await fetch(`${BASE_URL}/auth/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ current_password, new_password }),
    });
    if (!res.ok) {
      handleAuthError(res);
      const err = await res.json().catch(() => ({ detail: 'Failed to change password' }));
      throw { response: { data: err } };
    }
    return res.json();
  },

  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${BASE_URL}/auth/avatar`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
      },
      body: formData,
    });
    if (!res.ok) {
      handleAuthError(res);
      const err = await res.json().catch(() => ({ detail: 'Failed to upload avatar' }));
      throw { response: { data: err } };
    }
    return res.json();
  },

  deleteAvatar: async () => {
    const res = await fetch(`${BASE_URL}/auth/avatar`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
      },
    });
    if (!res.ok) {
      handleAuthError(res);
      const err = await res.json().catch(() => ({ detail: 'Failed to delete avatar' }));
      throw { response: { data: err } };
    }
    return res.json();
  },

  logout: async () => {
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { ...getAuthHeaders() },
      });
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('rp_auth_token');
    }
  },

  // --- FAVORITES ENDPOINTS ---
  getFavorites: async () => {
    const res = await fetch(`${BASE_URL}/favorites`, {
      headers: { ...getAuthHeaders() },
    });
    if (!res.ok) {
      handleAuthError(res);
      throw new Error('Failed to fetch favorites');
    }
    return res.json();
  },

  addFavorite: async (paperId) => {
    const res = await fetch(`${BASE_URL}/favorites/${paperId}`, {
      method: 'POST',
      headers: { ...getAuthHeaders() },
    });
    if (!res.ok) {
      handleAuthError(res);
      const err = await res.json().catch(() => ({ detail: 'Failed to add favorite' }));
      throw { response: { data: err } };
    }
    return res.json();
  },

  removeFavorite: async (paperId) => {
    const res = await fetch(`${BASE_URL}/favorites/${paperId}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    });
    if (!res.ok) {
      handleAuthError(res);
      const err = await res.json().catch(() => ({ detail: 'Failed to remove favorite' }));
      throw { response: { data: err } };
    }
    return res.json();
  },

  // --- UPLOAD ENDPOINT ---
  uploadPdf: async (file, onProgress) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${BASE_URL}/upload/pdf`);
      
      const token = localStorage.getItem('rp_auth_token');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.upload.onprogress = (event) => {
        if (onProgress && event.lengthComputable) {
          const percentCompleted = Math.round((event.loaded * 100) / event.total);
          onProgress(percentCompleted);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
          } catch (e) {
            reject(new Error('Failed to parse upload response'));
          }
        } else {
          if (xhr.status === 401) {
            localStorage.removeItem('rp_auth_token');
          }
          try {
            const errData = JSON.parse(xhr.responseText);
            reject({ response: { data: errData } });
          } catch {
            reject(new Error(xhr.statusText || 'Upload failed'));
          }
        }
      };

      xhr.onerror = () => reject(new Error('Network Error'));

      const formData = new FormData();
      formData.append('file', file);
      xhr.send(formData);
    });
  },

  // --- ANALYSIS ENDPOINTS ---
  getSummary: async (fileId) => {
    const res = await fetch(`${BASE_URL}/analysis/${fileId}/summary`, {
      headers: { ...getAuthHeaders() },
    });
    if (!res.ok) {
      handleAuthError(res);
      const err = await res.json().catch(() => ({ detail: 'Failed to fetch summary' }));
      throw { response: { data: err } };
    }
    return res.json();
  },

  getReview: async (fileId) => {
    const res = await fetch(`${BASE_URL}/analysis/${fileId}/review`, {
      headers: { ...getAuthHeaders() },
    });
    if (!res.ok) {
      handleAuthError(res);
      const err = await res.json().catch(() => ({ detail: 'Failed to fetch review' }));
      throw { response: { data: err } };
    }
    return res.json();
  },

  getActionPlan: async (fileId) => {
    const res = await fetch(`${BASE_URL}/analysis/${fileId}/action-plan`, {
      headers: { ...getAuthHeaders() },
    });
    if (!res.ok) {
      handleAuthError(res);
      const err = await res.json().catch(() => ({ detail: 'Failed to fetch action plan' }));
      throw { response: { data: err } };
    }
    return res.json();
  },

  // --- CHAT ENDPOINT ---
  sendChatMessage: async (fileId, question) => {
    const res = await fetch(`${BASE_URL}/chat/${fileId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ question }),
    });
    if (!res.ok) {
      handleAuthError(res);
      const err = await res.json().catch(() => ({ detail: 'Failed to send message' }));
      throw { response: { data: err } };
    }
    return res.json();
  },

  getChatHistory: async (fileId) => {
    const res = await fetch(`${BASE_URL}/chat/${fileId}/history`, {
      headers: { ...getAuthHeaders() },
    });
    if (!res.ok) {
      handleAuthError(res);
      const err = await res.json().catch(() => ({ detail: 'Failed to fetch chat history' }));
      throw { response: { data: err } };
    }
    return res.json();
  },

  // --- PAPERS & STATS ---
  getPapers: async () => {
    const res = await fetch(`${BASE_URL}/papers`, {
      headers: { ...getAuthHeaders() },
    });
    if (!res.ok) {
      handleAuthError(res);
      throw new Error('Failed to fetch library papers');
    }
    return res.json();
  },

  getStats: async () => {
    const res = await fetch(`${BASE_URL}/papers/stats`, {
      headers: { ...getAuthHeaders() },
    });
    if (!res.ok) {
      handleAuthError(res);
      throw new Error('Failed to fetch dashboard statistics');
    }
    return res.json();
  },
};
