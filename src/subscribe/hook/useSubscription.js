import { useContext, useState } from "react";
import { subscriptionService } from "../service/service";
import {PaddleContext} from "../../paddle/PaddleProvider"

export const useSubscription = () => {
    const subscribeToPlan = subscriptionService.subscribeToPlan;
    const { paddleLoaded, error: paddleError } = useContext(PaddleContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
  
    const subscribe = async (planId) => {
      if (!paddleLoaded) {
        setError(paddleError || 'Payment system is not ready yet. Please try again in a moment.');
        return;
      }
  
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
  
      try {
        const checkoutData = {
          product: planId,
          successCallback: async (data) => {
            try {
              await subscribeToPlan(data.product.id, data.checkout.recurring_prices.interval);
              setSuccessMessage('Subscription successful!');
            } catch (err) {
              setError('Failed to process subscription on server');
              console.error('Subscription error:', err);
            } finally {
              setLoading(false);
            }
          },
          closeCallback: () => {
            setLoading(false);
          },
        };
  
        window.Paddle.Checkout.open(checkoutData);
      } catch (err) {
        setError(err.message || 'An unexpected error occurred');
        console.error('Paddle checkout error:', err);
        setLoading(false);
      }
    };
  
    return {
      loading,
      error,
      successMessage,
      subscribe,
      paddleLoaded
  };
};
  