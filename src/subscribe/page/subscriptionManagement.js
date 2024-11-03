import React, { useEffect, useState } from 'react';
import { useSubscriptionManagement } from '../hook/useSubscriptionManagement';


export const SubscriptionManagement = () => {
  const {
    subscription,
    payments,
    loading,
    error,
    loadSubscriptionDetails,
    loadPaymentHistory,
    cancelSubscription,
  } = useSubscriptionManagement();

  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    loadSubscriptionDetails();
    loadPaymentHistory();
  }, []);

  const handleCancelConfirm = async () => {
    await cancelSubscription();
    setShowCancelModal(false);
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div className="subscription-management">
      {error && <div className="error-message">{error}</div>}

      {subscription && (
        <div className="subscription-details">
          <h2 className="section-title">Current Subscription</h2>
          <div className="subscription-info">
            <div>
              <p className="label">Plan</p>
              <p className="value">{subscription.plan_name}</p>
            </div>
            <div>
              <p className="label">Status</p>
              <p className="value">{subscription.status}</p>
            </div>
            <div>
              <p className="label">Next Billing Date</p>
              <p className="value">
                {new Date(subscription.next_bill_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="label">Amount</p>
              <p className="value">{`$${subscription.amount} / ${subscription.interval}`}</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowCancelModal(true)}
            className="cancel-button"
          >
            Cancel Subscription
          </button>
        </div>
      )}

      <div className="payment-history">
        <h2 className="section-title">Payment History</h2>
        <div className="table-container">
          <table className="payment-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{new Date(payment.date).toLocaleDateString()}</td>
                  <td>${payment.amount}</td>
                  <td>
                    <span className={`status-badge ${payment.status}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td>
                    <a
                      href={payment.invoice_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="invoice-link"
                    >
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCancelModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">Cancel Subscription</h3>
            <p className="modal-text">
              Are you sure you want to cancel your subscription? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                onClick={() => setShowCancelModal(false)}
                className="keep-button"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelConfirm}
                className="confirm-cancel-button"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
