import { useState, useEffect } from "react";
import {
  createMembership,
  getAllMemberships,
} from "../../services/membershipService";
import toast from "react-hot-toast";
import "./AdminPages.css";

const AddMembership = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "",
    features: "",
  });
  const [loading, setLoading] = useState(false);
  const [memberships, setMemberships] = useState([]);
  const [listLoading, setListLoading] = useState(true);

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    try {
      const data = await getAllMemberships();
      setMemberships(data.memberships || []);
    } catch {
      console.error("Failed to fetch memberships");
    } finally {
      setListLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createMembership(formData);
      toast.success("Membership plan added successfully!");
      setFormData({ name: "", price: "", duration: "", features: "" });
      fetchMemberships(); // Refresh list
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add membership plan",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1>Add Membership Plan</h1>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Plan Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Basic, Premium, Elite"
              required
            />
          </div>

          <div className="form-group">
            <label>Price (INR)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="29.99"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label>Duration</label>
            <select
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
            >
              <option value="">Select duration</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="form-group">
            <label>Features (comma separated)</label>
            <textarea
              name="features"
              value={formData.features}
              onChange={handleChange}
              placeholder="Access to gym, Personal trainer, Group classes"
              rows="5"
              required
            />
          </div>

          <button type="submit" className="admin-btn" disabled={loading}>
            {loading ? "Adding..." : "Add Membership Plan"}
          </button>
        </form>

        {/* Memberships List Table */}
        <h2 style={{ marginTop: "40px" }}>All Membership Plans</h2>
        {listLoading ? (
          <p>Loading memberships...</p>
        ) : (
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Duration</th>
                  <th>Features</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {memberships.length > 0 ? (
                  memberships.map((m) => (
                    <tr key={m._id}>
                      <td>{m.name}</td>
                      <td>RS.{m.price}</td>
                      <td>{m.duration}</td>
                      <td>{(m.features || []).join(", ") || "—"}</td>
                      <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No membership plans found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddMembership;
