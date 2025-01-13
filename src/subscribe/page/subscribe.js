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
          environment: "production",
          
          checkout: {
            settings: {
              displayMode: "overlay",
              theme: "dark",
              locale: "en",
            },
            eventCallback: async function(event) {
              
              switch (event.name) {
                case "checkout.completed":
                  setIsProcessingCheckout(true);

                  const eventData = JSON.parse(event.data || "{}");
                  const transactionDetails = {
                    id: eventData.id || "",
                    status: eventData.status || "",
                    customer_id: eventData.customer?.id || "",
                    address_id: eventData.customer?.address?.id || "",
                    items: eventData.items || [],
                    totals: eventData.totals || {},
                    currency_code: eventData.currency_code || "",
                  };

                  try {
                    const response = await axios.post(
                      `${process.env.REACT_APP_AWS_URL}/api/subscription/confirm`,
                      transactionDetails,
                      {
                        withCredentials: true,
                        headers: {
                          "Content-Type": "application/json",
                        },
                      }
                    );

                    if (response.status === 200) {
                      setTimeout(() => {
                        alert("Subscription confirmed successfully!");
                        navigate("/");
                      }, 500);
                    }
                  } catch (error) {
                    console.error("Error confirming subscription:", error.response || error.message);
                    setCheckoutError(
                      error.response?.data?.message || "Failed to confirm subscription. Please contact support."
                    );
                  } finally {
                    setIsProcessingCheckout(false);
                  }
                  break;

                case "checkout.error":
                  setCheckoutError("An error occurred during checkout. Please try again.");
                  setIsProcessingCheckout(false);
                  break;

                case "checkout.closed":
                  if (isProcessingCheckout) {
                    setCheckoutError("Please wait while we confirm your subscription...");
                  }
                  break;

                default:
                  break;
              }
            },
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
        successUrl: "http://twineaihub.com/",
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
      description: ["Access to basic features", "Email support", "Limited to 750,000 tokens"],
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
          <div key={plan.name} className={`plan-card ${plan.popular ? "popular-plan" : ""}`}>
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
      {checkoutError && <div className="error-message">{checkoutError}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default SubscriptionPage;

