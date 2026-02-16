import { useEffect, useState } from "react";
import { getUserPlans, cleanupDuplicatePlans } from "../services/userPlanService";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import "./MyPlans.css";

const MyPlans = () => {
    const { user } = useAuth();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchPlans();
        }
    }, [user]);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            // Clean up any duplicate records first
            await cleanupDuplicatePlans();
            const data = await getUserPlans();
            setPlans(data.plans || []);
        } catch (error) {
            toast.error("Failed to load your plans");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "active":
                return "status-active";
            case "cancelled":
                return "status-cancelled";
            case "expired":
                return "status-expired";
            case "past_due":
                return "status-past-due";
            default:
                return "";
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <section className="my-plans-section">
            <h1 className="my-plans-title">MY PLANS</h1>
            <p className="my-plans-subtitle">Your purchased membership plans</p>

            {loading ? (
                <div className="my-plans-loading">
                    <div className="spinner"></div>
                    <p>Loading your plans...</p>
                </div>
            ) : plans.length === 0 ? (
                <div className="my-plans-empty">
                    <div className="empty-icon">📋</div>
                    <h2>No Plans Yet</h2>
                    <p>You haven't purchased any membership plans yet.</p>
                    <a href="/membership" className="browse-plans-btn">
                        Browse Plans
                    </a>
                </div>
            ) : (
                <div className="my-plans-grid">
                    {plans.map((plan) => {
                        const membership = plan.membershipId;
                        const gymName = membership?.createdBy?.name || "Gym";
                        return (
                            <div key={plan._id} className="my-plan-card">
                                <div className="plan-card-header">
                                    <span className="gym-badge">{gymName}</span>
                                    <span
                                        className={`status-badge ${getStatusBadgeClass(plan.status)}`}
                                    >
                                        {plan.status?.toUpperCase()}
                                    </span>
                                </div>

                                <h2 className="plan-name">
                                    {membership?.name || "Unknown Plan"}
                                </h2>

                                <p className="plan-price">
                                    ₹{membership?.price || 0}{" "}
                                    <span>/{membership?.duration || "—"}</span>
                                </p>

                                <div className="plan-dates">
                                    <div className="date-row">
                                        <span className="date-label">Start Date</span>
                                        <span className="date-value">
                                            {formatDate(plan.startDate)}
                                        </span>
                                    </div>
                                    <div className="date-row">
                                        <span className="date-label">End Date</span>
                                        <span className="date-value">
                                            {formatDate(plan.endDate)}
                                        </span>
                                    </div>
                                    <div className="date-row">
                                        <span className="date-label">Purchased</span>
                                        <span className="date-value">
                                            {formatDate(plan.purchasedAt)}
                                        </span>
                                    </div>
                                </div>

                                {membership?.features && membership.features.length > 0 && (
                                    <ul className="plan-features">
                                        {membership.features.map((feature, idx) => (
                                            <li key={idx}>{feature}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default MyPlans;
