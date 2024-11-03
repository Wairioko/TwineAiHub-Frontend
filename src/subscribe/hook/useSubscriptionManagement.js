import { useState, useEffect } from 'react';
import { subscriptionService } from '../service/service';

export const useSubscriptionManagement = () => {
  const [subscription, setSubscription] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadSubscriptionDetails = async () => {
    try {
      setLoading(true);
      const data = await subscriptionService.getSubscriptionDetails();
      setSubscription(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadPaymentHistory = async () => {
    try {
      setLoading(true);
      const data = await subscriptionService.getPaymentHistory();
      setPayments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async () => {
    try {
      setLoading(true);
      await subscriptionService.cancelSubscription(subscription.id);
      await loadSubscriptionDetails(); // Reload subscription details
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    subscription,
    payments,
    loading,
    error,
    loadSubscriptionDetails,
    loadPaymentHistory,
    cancelSubscription,
  };
};