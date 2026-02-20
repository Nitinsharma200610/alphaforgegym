import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getAdminStats } from "../../services/userService";
import "./AdminPages.css";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalMemberships: 0,
    activeSubscriptions: 0,
    totalServices: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data.stats);
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1>Admin Dashboard</h1>
        <p className="welcome-text">Welcome back, {user?.name}!</p>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h3>My Memberships</h3>
            <p className="card-number">{stats.totalMemberships}</p>
          </div>
          <div className="dashboard-card">
            <h3>Active Subscribers</h3>
            <p className="card-number">{stats.activeSubscriptions}</p>
          </div>
          <div className="dashboard-card">
            <h3>My Services</h3>
            <p className="card-number">{stats.totalServices}</p>
          </div>
          <div className="dashboard-card">
            <h3>Revenue (Est.)</h3>
            <p className="card-number">Rs. {stats.totalRevenue}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
