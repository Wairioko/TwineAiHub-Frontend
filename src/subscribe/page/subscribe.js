import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "../hook/useSubscription";
import { initializePaddle } from "@paddle/paddle-js";
import axios from "axios";



const SubscriptionPage = () => {
  const { subscribe, loading, error, successMessage } = useSubscription();
  const navigate = useNavigate();
  const [paddle, setPaddle] = useState(null);
  const [checkoutError, setCheckoutError] = useState(null);

  const PRODUCT_IDS = {
    Basic: { weekly: process.env.REACT_APP_BASIC_WEEKLY_ID },
    Standard: { monthly: process.env.REACT_APP_STANDARD_MONTHLY_ID },
    Premium: { monthlyPremium: process.env.REACT_APP_PREMIUM_MONTHLY_ID },
  };

  useEffect(() => {
    const initPaddle = async () => {
      try {
        const paddleInstance = await initializePaddle({
          token: process.env.REACT_APP_PADDLE_TOKEN,
          environment: "sandbox",
          checkout: {
            settings: {
              displayMode: "overlay",
              theme: "light",
              locale: "en",
            },
            eventCallback: async (event) => {
              console.log('Received checkout event:', event); 

              if (event.name === 'checkout.completed') {
                const transactionDetails = {
                  checkoutId: event.id,
                  status: event.status,
                  customerId: event.customer_id,
                  addressId: event.address_id,
                  subscriptionId: event.subscription_id,
                  invoiceId: event.invoice_id,
                  invoiceNumber: event.invoice_number,
                  billingDetails: event.billing_details,
                  currencyCode: event.currency_code,
                  billingPeriod: event.billing_period,
                  createdAt: event.created_at,
                  updatedAt: event.updated_at,
                  items: event.items,
                };

                try {
                  console.log('Sending transaction details:', transactionDetails); // Debug log

                  const response = await axios.post(
                    `${process.env.REACT_APP_AWS_URL}/api/subscription/confirm`,
                    JSON.stringify(transactionDetails), // Explicitly stringify the data
                    {
                      withCredentials: true,
                      headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                      }
                    }
                  );

                  console.log('Server response:', response); // Debug log

                  if (response.status === 200) {
                    alert('Subscription confirmed successfully!');
                    navigate('/');
                  }
                } catch (error) {
                  console.error('Error confirming subscription:', error);
                  console.error('Error details:', error.response?.data); // Debug log
                  setCheckoutError(error.response?.data?.message || 'Failed to confirm subscription');
                }
              }
            }
          },
        });
        setPaddle(paddleInstance);
      } catch (initError) {
        console.error("Failed to initialize Paddle:", initError);
        setCheckoutError("Failed to initialize payment system");
      }
    };

    initPaddle();
  }, [navigate]);

  // Rest of your component code remains the same...

  return (
    <div className="subscription-container">
      <h2 className="subscription-heading">Choose your plan</h2>

      <div className="plans-grid">
        {plans.map((plan) => (
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
              disabled={loading}
              className="get-started-button"
            >
              {loading ? "Processing..." : "Get Started"}
            </button>
          </div>
        ))}
      </div>

      {checkoutError && <div className="error-message">{checkoutError}</div>}
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default SubscriptionPage;