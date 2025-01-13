import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "../hook/useSubscription";
import { initializePaddle } from "@paddle/paddle-js";
import axios from "axios";



const SubscriptionPage = () => {
  const { subscribe, loading, error, successMessage, setError } = useSubscription();
  const navigate = useNavigate();
  const [paddle, setPaddle] = useState(null);

  const PRODUCT_IDS = {
    Basic: { weekly: process.env.REACT_APP_BASIC_WEEKLY_ID },
    Standard: { monthly: process.env.REACT_APP_STANDARD_MONTHLY_ID },
    Premium: { monthlyPremium: process.env.REACT_APP_PREMIUM_MONTHLY_ID },
  };

  useEffect(() => {
    const initPaddle = async () => {
      console.log('Initializing Paddle...'); // Add initial logging
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
            successCallback: async (data) => {
              // Log the success callback
              console.log('Success callback received:', data);
              
              try {
                const transactionDetails = {
                  id: data.id,
                  status: data.status,
                  customer_id: data.customer?.id,
                  address_id: data.customer?.address?.id,
                  subscription_id: data.items?.[0]?.product?.id,
                  invoice_id: data.id,
                  currency_code: data.currency_code,
                  billing_period: data.items?.[0]?.billing_cycle?.interval,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  items: data.items,
                };
    
                console.log('Processing transaction details:', transactionDetails);
    
                const response = await axios.post(
                  `${process.env.REACT_APP_AWS_URL}/api/subscription/confirm`,
                  transactionDetails,
                  {
                    withCredentials: true,
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  }
                );
    
                console.log('Server response:', response);
    
                if (response.status === 200) {
                  alert('Subscription confirmed successfully!');
                  navigate('/');
                }
              } catch (error) {
                console.error('Error processing success callback:', error);
                setError(error.response?.data?.message || "Failed to process checkout");
              }
            },
            errorCallback: (error) => {
              console.error('Checkout error:', error);
              setError("Checkout failed");
            }
          }
        });
        
        console.log('Paddle initialized successfully');
        setPaddle(paddleInstance);
      } catch (initError) {
        console.error('Paddle initialization failed:', initError);
      }
    };
    initPaddle();
  }, [navigate]);

  const handleGetStarted = (plan, billingCycle) => {
    console.log('Starting checkout process:', { plan, billingCycle });
    
    const productId = PRODUCT_IDS[plan]?.[billingCycle];
    if (!productId) {
      console.error('Product ID not found:', { plan, billingCycle, PRODUCT_IDS });
      return;
    }

    if (!paddle) {
      console.error('Paddle instance not initialized');
      return;
    }

    try {
      console.log('Opening Paddle checkout with product:', productId);
      paddle.Checkout.open({
        items: [{ priceId: productId, quantity: 1 }],
      });
    } catch (checkoutError) {
      console.error('Failed to open checkout:', checkoutError);
    }
  };

  const plans = [
    {
      name: "Basic",
      price: "7 USD",
      period: "Week",
      billingCycle: "weekly",
      description: [
        "Access to basic features",
        "Email support",
        "Limited to 750,000 tokens",
      ],
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
        "Limited to 3,000,000 tokens",
      ],
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
      ],
    },
  ];

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

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default SubscriptionPage;

