import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "../hook/useSubscription";
import { initializePaddle } from "@paddle/paddle-js";
import axios from "axios";



const SubscriptionPage = () => {
  const { subscribe, loading, error, successMessage } = useSubscription();
  const navigate = useNavigate();
  const [paddle, setPaddle] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

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
              console.log('Paddle event received:', event.name);
              
              switch (event.name) {
                case 'checkout.completed':
                  setIsProcessingCheckout(true);
                  
                  const transactionDetails = {
                    id: event.id,
                    status: event.status,
                    customer_id: event.customer_id,
                    address_id: event.address_id,
                    subscription_id: event.subscription_id,
                    invoice_id: event.invoice_id,
                    invoice_number: event.invoice_number,
                    billing_details: event.billing_details,
                    currency_code: event.currency_code,
                    billing_period: event.billing_period,
                    created_at: event.created_at,
                    updated_at: event.updated_at,
                    items: event.items,
                  };

                  try {
                    const response = await axios.post(
                      `${process.env.REACT_APP_AWS_URL}/api/subscription/confirm`,
                      transactionDetails,
                      {
                        withCredentials: true,
                        headers: {
                          'Content-Type': 'application/json',
                        }
                      }
                    );

                    if (response.status === 200) {
                      setTimeout(() => {
                        alert('Subscription confirmed successfully!');
                        navigate('/');
                      }, 500);
                    }
                  } catch (error) {
                    console.error('Error confirming subscription:', error);
                    setCheckoutError(error.response?.data?.message || 'Failed to confirm subscription');
                  } finally {
                    setIsProcessingCheckout(false);
                  }
                  break;

                case 'checkout.error':
                  setCheckoutError('An error occurred during checkout. Please try again.');
                  setIsProcessingCheckout(false);
                  break;

                case 'checkout.closed':
                  if (isProcessingCheckout) {
                    setCheckoutError('Please wait while we confirm your subscription...');
                  }
                  break;

                default:
                  break;
              }
            }
          },
        });

        setPaddle(paddleInstance);
        setIsReady(true);
      } catch (initError) {
        console.error("Failed to initialize Paddle:", initError);
        setCheckoutError("Failed to initialize payment system. Please try again later.");
        setIsReady(false);
      }
    };

    initPaddle();
  }, [navigate, isProcessingCheckout]);

  const handleGetStarted = async (plan, billingCycle) => {
    setCheckoutError(null);
    
    try {
      const productId = PRODUCT_IDS[plan]?.[billingCycle];
      if (!productId) {
        throw new Error(`Invalid plan or billing cycle: ${plan}, ${billingCycle}`);
      }

      if (!paddle || !isReady) {
        throw new Error("Payment system not initialized. Please refresh the page.");
      }

      await paddle.Checkout.open({
        items: [{ priceId: productId, quantity: 1 }],
      });
    } catch (error) {
      console.error("Checkout error:", error);
      setCheckoutError(error.message || "Failed to start checkout process. Please try again.");
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

