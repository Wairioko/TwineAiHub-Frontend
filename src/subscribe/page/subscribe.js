import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "../hook/useSubscription";
import { initializePaddle } from "@paddle/paddle-js";



const SubscriptionPage = () => {
  const { subscribe, loading, error, successMessage } = useSubscription();
  const navigate = useNavigate();
  const [paddle, setPaddle] = useState(null);

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
          },
        });
        setPaddle(paddleInstance);
        console.log("Paddle initialized:", paddleInstance);
      } catch (initError) {
        console.error("Failed to initialize Paddle:", initError);
      }
    };

    initPaddle();
  }, []);

  const handleGetStarted = (plan, billingCycle) => {
    const productId = PRODUCT_IDS[plan]?.[billingCycle];
    if (!productId) {
      console.error(`Invalid plan or billing cycle: ${plan}, ${billingCycle}`);
      return;
    }

    if (!paddle) {
      console.error("Paddle.js has not been initialized.");
      return;
    }

    try {
      paddle.Checkout.open({
        items: [{ priceId: productId, quantity: 1 }],
      });
    } catch (checkoutError) {
      console.error("Failed to open Paddle checkout:", checkoutError);
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

