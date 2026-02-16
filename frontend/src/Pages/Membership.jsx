import { useEffect, useState } from "react";
import "./Membership.css";
import {
  getAllMemberships,
  checkoutMembership,
} from "../services/membershipService";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

const Membership = () => {
  const { user, refreshUser } = useAuth();
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMemberships();
    // Refresh user data to get latest subscription status
    if (user) {
      refreshUser();
    }
  }, []);

  const fetchMemberships = async () => {
    try {
      setLoading(true);
      const data = await getAllMemberships();
      setMemberships(data.memberships || []);
    } catch (error) {
      toast.error("Failed to load memberships");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Check if user has an active subscription to a specific membership
  const isAlreadySubscribed = (membershipId) => {
    if (!user?.subscription?.status || user.subscription.status !== "active") {
      return false;
    }
    const userMembershipId = user.subscription.membershipId;
    if (!userMembershipId) return false;
    // Handle both populated object and raw ID string
    const userSubId =
      typeof userMembershipId === "object"
        ? userMembershipId._id?.toString()
        : userMembershipId.toString();
    return userSubId === membershipId.toString();
  };

  const handleChoosePlan = async (membershipId) => {
    if (!user) {
      toast.error("Please login first");
      return;
    }

    if (isAlreadySubscribed(membershipId)) {
      toast.error("You are already subscribed to this plan");
      return;
    }

    try {
      const data = await checkoutMembership(membershipId, user._id);
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to initiate checkout");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Checkout failed");
      console.error(error);
    }
  };

  // Group memberships by admin/gym name
  const groupedMemberships = memberships.reduce((groups, membership) => {
    const gymName = membership.createdBy?.name || "Other";
    if (!groups[gymName]) {
      groups[gymName] = [];
    }
    groups[gymName].push(membership);
    return groups;
  }, {});

  return (
    <section className="membership">
      <h1 className="membership-title">MEMBERSHIP PLANS</h1>

      {loading ? (
        <p style={{ textAlign: "center", color: "#ecdddd", fontSize: "18px" }}>
          Loading memberships...
        </p>
      ) : memberships.length === 0 ? (
        <p style={{ textAlign: "center", color: "#ecdddd", fontSize: "18px" }}>
          No memberships available
        </p>
      ) : (
        Object.entries(groupedMemberships).map(([gymName, plans]) => (
          <div key={gymName} className="gym-group">
            <div className="gym-group-header">
              <div className="gym-group-icon">🏋️</div>
              <h2 className="gym-group-name">{gymName}</h2>
            </div>
            <div className="plans">
              {plans.map((membership, index) => {
                const subscribed = isAlreadySubscribed(membership._id);
                return (
                  <div
                    key={membership._id}
                    className={`plan-card ${index === 1 ? "popular" : index === 2 ? "elite" : ""} ${subscribed ? "subscribed" : ""}`}
                  >
                    {subscribed && (
                      <div className="subscribed-badge">✓ Active</div>
                    )}
                    <h2>{membership.name}</h2>
                    <p className="price">
                      ₹{membership.price} <span>/{membership.duration}</span>
                    </p>
                    <ul>
                      {membership.features &&
                        membership.features.map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                    </ul>
                    <button
                      onClick={() => handleChoosePlan(membership._id)}
                      disabled={!user || subscribed}
                      className={subscribed ? "subscribed-btn" : ""}
                    >
                      {!user
                        ? "Login to Choose"
                        : subscribed
                          ? "Already Registered"
                          : "Choose Plan"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </section>
  );
};

export default Membership;
