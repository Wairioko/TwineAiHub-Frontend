import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "../hook/useSubscription";

const SubscriptionPage = () => {
  const { subscribe, loading, error, successMessage } = useSubscription();
  const navigate = useNavigate();
  const [paddleLoaded, setPaddleLoaded] = useState(false);
  const [processingPlan, setProcessingPlan] = useState(null);

  const PRODUCT_IDS = {
    Basic: { weekly: process.env.REACT_APP_BASIC_WEEKLY_ID },
    Standard: { monthly: process.env.REACT_APP_STANDARD_MONTHLY_ID },
    Premium: { monthlyPremium: process.env.REACT_APP_PREMIUM_MONTHLY_ID },
  };

  useEffect(() => {
    const paddleScript = document.createElement('script');
    paddleScript.src = 'https://cdn.paddle.com/paddle/paddle.js';
    paddleScript.type = 'text/javascript';
    paddleScript.async = true;
    
    // Add error handling for script loading
    paddleScript.onerror = () => {
      console.error('Failed to load Paddle script');
      setPaddleLoaded(false);
    };
    
    document.body.appendChild(paddleScript);
    const VendorId = parseInt(process.env.REACT_APP_PADDLE_VENDOR_ID, 10);

    paddleScript.onload = () => {
      try {
        window.Paddle.Setup({ 
          vendor: VendorId,
          eventCallback: handlePaddleEvent 
        });
        setPaddleLoaded(true);
      } catch (err) {
        console.error('Failed to initialize Paddle:', err);
        setPaddleLoaded(false);
      }
    };

    return () => {
      if (document.body.contains(paddleScript)) {
        document.body.removeChild(paddleScript);
      }
    };
  }, []);

  const handlePaddleEvent = (eventData) => {
    try {
      switch(eventData.event) {
        case 'checkout.completed':
          if (eventData.checkout?.subscription?.subscription_id) {
            subscribe(eventData.checkout.subscription.subscription_id);
          } else {
            console.error('Missing subscription ID in completed checkout');
          }
          setProcessingPlan(null);
          break;
        case 'checkout.closed':
          setProcessingPlan(null);
          break;
        case 'checkout.error':
          console.error('Checkout error:', eventData.error);
          setProcessingPlan(null);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error('Error handling Paddle event:', err);
      setProcessingPlan(null);
    }
  };

  const handleGetStarted = (plan, billingCycle) => {
    if (!paddleLoaded) {
      console.error("Paddle is not loaded yet");
      return;
    }
  
    const productId = PRODUCT_IDS[plan]?.[billingCycle];
    if (!productId) {
      console.error(`No product ID found for plan: ${plan} and billing cycle: ${billingCycle}`);
      return;
    }
  
    console.log("Opening Paddle checkout with:", {
      productId,
      parentURL: window.location.href,
    });
  
    setProcessingPlan(plan);
  
    try {
      window.Paddle.Checkout.open({
        product: productId,
        parentURL:"https://twineaihub.com",
        successCallback: (data) => {
          if (data?.subscription?.subscription_id) {
            console.log("Checkout complete", data);
            subscribe(data.subscription.subscription_id);
          } else {
            console.error("Missing subscription data in success callback");
          }
          setProcessingPlan(null);
        },
        closeCallback: () => {
          console.log("Checkout closed");
          setProcessingPlan(null);
        },
        loadCallback: () => {
          console.log("Checkout loaded");
        },
      });
    } catch (err) {
      console.error("Error opening Paddle checkout:", err);
      setProcessingPlan(null);
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
    }
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
              disabled={loading || !paddleLoaded || processingPlan !== null}
              className="get-started-button"
            >
              {processingPlan === plan.name ? "Processing..." : 
               loading ? "Please wait..." : 
               !paddleLoaded ? "Loading..." : 
               "Get Started"}
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

