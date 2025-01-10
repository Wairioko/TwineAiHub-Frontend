import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "../hook/useSubscription";
import {initializePaddle} from "@paddle/paddle-js"

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
    initializePaddle({
      token: process.env.REACT_APP_PADDLE_TOKEN,
      environment: "sandbox", // Or "production" when you go live
      checkout: {
        settings: {
          displayMode: "overlay",
          theme: "light",
          locale: "en",
        },
      },
    })
    .then((paddleInstance) => {
      console.log("paddleInstance", paddleInstance); // Verify Paddle instance
      if (paddleInstance) {
        setPaddle(paddleInstance);
      }
    })
    .catch((error) => {
      console.error("Error initializing Paddle:", error);
    });
  }, []);

  const handleGetStarted = (plan, billingCycle) => {
    const productId = PRODUCT_IDS[plan][billingCycle];
    if (!productId) {
      console.error(
        `No product ID found for plan: ${plan} and billing cycle: ${billingCycle}`
      );
      return;
    }

    if (!paddle) {
      console.error("Paddle.js is not initialized yet.");
      return;
    }

    // Use the initialized Paddle instance to open the checkout
    paddle.Checkout.open({
      items: [
        {
          priceId: productId,
          quantity: 1,
        },
      ],
    });
  };

  // ... rest of your component code (plans, UI, etc.) ...
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

