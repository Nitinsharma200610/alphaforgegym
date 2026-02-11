import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { verifyCheckoutSession } from "../services/membershipService";
import "./CheckoutSuccess.css";

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser, user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleSuccessfulCheckout = async () => {
      const sessionId = searchParams.get("session_id");

      if (!sessionId) {
        toast.error("Invalid checkout session");
        navigate("/membership");
        return;
      }

      if (!user) {
        toast.error("Please login to complete checkout");
        navigate("/login");
        return;
      }

      try {
        setLoading(true);

        // Verify checkout session and update subscription
        console.log("Verifying checkout session:", sessionId);
        await verifyCheckoutSession(sessionId);

        // Refresh user data to get updated subscription
        await refreshUser();

        // Redirect to services page
        setTimeout(() => navigate("/cards"), 2000);
      } catch (error) {
        console.error("Checkout verification error:", error);
        toast.error(
          error.response?.data?.message || "Error processing subscription",
        );
        setTimeout(() => navigate("/membership"), 2000);
      } finally {
        setLoading(false);
      }
    };

    handleSuccessfulCheckout();
  }, [searchParams, navigate, refreshUser, user]);

  return (
    <div className="checkout-success-page">
      <div className="success-container">
        {loading ? (
          <>
            <h1>Processing Payment...</h1>
            <p>Please wait while we confirm your subscription.</p>
          </>
        ) : (
          <>
            <div className="success-checkmark">✓</div>
            <h1>Payment Successful!</h1>
            <p>Your subscription has been activated.</p>
            <p style={{ marginTop: "10px", fontSize: "14px", color: "#999" }}>
              Redirecting to services...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutSuccess;
