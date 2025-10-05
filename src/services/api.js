const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  async register(userData) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return data;
  },

  async login(credentials) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  },

  async logout() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data;
  },

  async getCurrentUser() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get user data');
    }

    return data;
  },

  async submitContactForm(formData) {
    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit contact form');
    }

    return data;
  },

  async getMeals(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const url = queryParams ? `${API_URL}/meals?${queryParams}` : `${API_URL}/meals`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch meals');
    }

    return data;
  },

  async getMealsByOwner(timeOfDay) {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const response = await fetch(`${API_URL}/meals`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch meals');
    }

    return data;
  },

  async createMeal(mealData) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/meals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(mealData),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.errors && data.errors.length > 0
        ? data.errors.map(e => e.msg).join(', ')
        : data.message || 'Failed to create meal';
      throw new Error(errorMessage);
    }

    return data;
  },

  async updateMeal(mealId, mealData) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/meals/${mealId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(mealData),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.errors && data.errors.length > 0
        ? data.errors.map(e => e.msg).join(', ')
        : data.message || 'Failed to update meal';
      throw new Error(errorMessage);
    }

    return data;
  },

  async deleteMeal(mealId) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/meals/${mealId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete meal');
    }

    return data;
  },
};
