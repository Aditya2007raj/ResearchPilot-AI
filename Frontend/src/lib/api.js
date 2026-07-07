const BASE_URL = 'http://localhost:8000/api/v1';

export const api = {
  uploadPdf: async (file, onProgress) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${BASE_URL}/upload/pdf`);

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

  getSummary: async (fileId) => {
    const res = await fetch(`${BASE_URL}/analysis/${fileId}/summary`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to fetch summary' }));
      throw { response: { data: err } };
    }
    return res.json();
  },

  getReview: async (fileId) => {
    const res = await fetch(`${BASE_URL}/analysis/${fileId}/review`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to fetch review' }));
      throw { response: { data: err } };
    }
    return res.json();
  },

  getActionPlan: async (fileId) => {
    const res = await fetch(`${BASE_URL}/analysis/${fileId}/action-plan`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to fetch action plan' }));
      throw { response: { data: err } };
    }
    return res.json();
  },

  sendChatMessage: async (fileId, question) => {
    const res = await fetch(`${BASE_URL}/chat/${fileId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to send message' }));
      throw { response: { data: err } };
    }
    return res.json();
  },

  getPapers: async () => {
    const res = await fetch(`${BASE_URL}/papers`);
    if (!res.ok) {
      throw new Error('Failed to fetch library papers');
    }
    return res.json();
  },

  getStats: async () => {
    const res = await fetch(`${BASE_URL}/papers/stats`);
    if (!res.ok) {
      throw new Error('Failed to fetch dashboard statistics');
    }
    return res.json();
  },
};
