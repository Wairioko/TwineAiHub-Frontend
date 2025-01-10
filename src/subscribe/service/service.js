export const subscriptionService = {
  async subscribeToPlan(plan, billingCycle) {
    return await apiRequest('/api/subscribe', {
      method: 'POST',
      body: { plan, billingCycle },
    });
  },

  async cancelSubscription(subscriptionId) {
    return await apiRequest('/api/subscription/cancel', {
      method: 'POST',
      body: { subscriptionId },
    });
  },

  async getPaymentHistory() {
    return await apiRequest('/api/subscription/payments', {
      method: 'GET',
    });
  },

  async getSubscriptionDetails() {
    return await apiRequest('/api/subscription/details', {
      method: 'GET',
    });
  }
};

const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw new Error(error.message || 'An unexpected error occurred');
  }
};
