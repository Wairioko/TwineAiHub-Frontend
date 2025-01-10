import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "../hook/useSubscription";

const SubscriptionPage = () => {
  const { subscribe, loading, error, successMessage } = useSubscription();
  const navigate = useNavigate();
  const [paddleLoaded, setPaddleLoaded] = useState(false);

  const PRODUCT_IDS = {
    Basic: { weekly: process.env.REACT_APP_BASIC_WEEKLY_ID },
    Standard: { monthly: process.env.REACT_APP_STANDARD_MONTHLY_ID },
    Premium: { monthlyPremium: process.env.REACT_APP_PREMIUM_MONTHLY_ID },
  };

  // Initialize Paddle
  useEffect(() => {
    // Load Paddle script
    const paddleScript = document.createElement('script');
    paddleScript.src = 'https://cdn.paddle.com/paddle/paddle.js';
    paddleScript.type = 'text/javascript';
    paddleScript.async = true;
    document.body.appendChild(paddleScript);

    paddleScript.onload = () => {
      // Initialize Paddle with your vendor ID
      window.Paddle.Setup({ 
        vendor: process.env.REACT_APP_PADDLE_VENDOR_ID,
        eventCallback: handlePaddleEvent 
      });
      setPaddleLoaded(true);
    };

    return () => {
      document.body.removeChild(paddleScript);
    };
  }, []);

  // Handle Paddle events
  const handlePaddleEvent = (eventData) => {
    switch(eventData.event) {
      case 'checkout.completed':
        // Handle successful subscription
        subscribe(eventData.checkout.subscription.subscription_id);
        break;
      case 'checkout.closed':
        // Handle checkout closure
        console.log('Checkout closed');
        break;
      case 'checkout.error':
        // Handle checkout error
        console.error('Checkout error:', eventData.error);
        break;
      default:
        break;
    }
  };

  const handleGetStarted = (plan, billingCycle) => {
    const productId = PRODUCT_IDS[plan][billingCycle];
    if (!productId) {
      console.error(`No product ID found for plan: ${plan} and billing cycle: ${billingCycle}`);
      return;
    }

    if (!paddleLoaded) {
      console.error('Paddle is not loaded yet');
      return;
    }

    // Open Paddle checkout
    window.Paddle.Checkout.open({
      product: productId,
      email: undefined, // Optional: Pre-fill customer email
      successCallback: (data) => {
        console.log('Checkout complete', data);
        subscribe(data.subscription.subscription_id);
      },
      closeCallback: () => {
        console.log('Checkout closed');
      },
      loadCallback: () => {
        console.log('Checkout loaded');
      }
    });
  };

  return (
    <div className="subscription-container">
      <h2 className="subscription-heading">Choose your plan</h2>

      <div className="plans-grid">
        {[
          {
            name: "Basic",
            price: "7 USD",
            period: "Week",
            billingCycle: "weekly",
            description: [
              "Access to basic features",
              "Email support",
              'Limited to 750,000 tokens'
            ]
          },
          {
            name: "Standard",
            price: "25 USD",
            period: "Month",
            billingCycle: "monthly",
            popular: true,
            description: [
              "All Standard features included",
              "Priority support",
              "Monthly updates",
              "Access to exclusive content",
              "Limited to 3,000,000 tokens"
            ]
          },
          {
            name: "Premium",
            price: "49 USD",
            period: "Month",
            billingCycle: "monthlyPremium",
            description: [
              "No token limits",
              "Full access to premium features",
              "Priority support",
              "Advanced analytics",
              "Access to feature upgrades",
            ]
          },
        ].map((plan) => (
          <div
            key={plan.name}
            className={`plan-card ${plan.popular ? "popular-plan" : ""}`}
          >
            <h3 className="plan-title">{plan.name} Plan</h3>
            <p className="plan-price">{`${plan.price} / ${plan.period}`}</p>
            <ul className="plan-description-list">
              {plan.description.map((item, index) => (
                <li key={index} className="plan-description-item">
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleGetStarted(plan.name, plan.billingCycle)}
              disabled={loading || !paddleLoaded}
              className="get-started-button"
            >
              {loading ? "Processing..." : "Get Started"}
            </button>
          </div>
        ))}
      </div>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default SubscriptionPage;
