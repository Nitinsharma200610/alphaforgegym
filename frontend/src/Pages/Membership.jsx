import { useEffect, useState } from "react";
import "./Membership.css";
import membershipBg from "../assets/membership-bg.png";
import {
  getAllMemberships,
  checkoutMembership,
} from "../services/membershipService";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { use } from "react";

const Membership = () => {
  const { user } = useAuth();
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMemberships();
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

  const handleChoosePlan = async (membershipId) => {
    if (!user) {
      toast.error("Please login first");
      return;
    }

    try {
      const data = await checkoutMembership(membershipId, user._id);
      console.log(data, "test")
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

console.log(memberships, "test")
console.log(user)

  return (
    <section
      className="membership"
   
    >
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
        <div className="plans">
          {memberships.map((membership, index) => (
            <div
              key={membership._id}
              className={`plan-card ${index === 1 ? "popular" : index === 2 ? "elite" : ""}`}
            >
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
                disabled={!user}
              >
                {user ? "Choose Plan" : "Login to Choose"}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Membership;
