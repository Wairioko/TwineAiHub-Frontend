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
  
  // Helper function for API requests
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
      throw error;
    }
  };