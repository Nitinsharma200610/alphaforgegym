import { useState, useEffect } from "react";
import {
  createMembership,
  getAllMemberships,
  updateMembership,
  deleteMembership,
} from "../../services/membershipService";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import "./AdminPages.css";

const AddMembership = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "",
    features: "",
  });
  const [loading, setLoading] = useState(false);
  const [memberships, setMemberships] = useState([]);
  const [listLoading, setListLoading] = useState(true);

  // Edit modal state
  const [editModal, setEditModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    features: "",
  });
  const [editLoading, setEditLoading] = useState(false);

  // Delete confirmation state
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    try {
      // Only fetch memberships created by this admin
      const data = await getAllMemberships(user?._id);
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
      fetchMemberships();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add membership plan",
      );
    } finally {
      setLoading(false);
    }
  };

  // Edit handlers
  const openEditModal = (membership) => {
    setEditId(membership._id);
    setEditData({
      name: membership.name,
      features: (membership.features || []).join(", "),
    });
    setEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await updateMembership(editId, editData);
      toast.success("Membership updated successfully!");
      setEditModal(false);
      setEditId(null);
      fetchMemberships();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update membership",
      );
    } finally {
      setEditLoading(false);
    }
  };

  // Delete handlers
  const openDeleteModal = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteMembership(deleteId);
      toast.success("Membership deleted successfully!");
      setDeleteModal(false);
      setDeleteId(null);
      fetchMemberships();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete membership",
      );
    } finally {
      setDeleteLoading(false);
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
        <h2 style={{ marginTop: "40px" }}>My Membership Plans</h2>
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
                  <th>Actions</th>
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
                      <td>
                        <div className="action-btns">
                          <button
                            className="edit-btn"
                            onClick={() => openEditModal(m)}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => openDeleteModal(m._id)}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      No membership plans found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div className="modal-overlay" onClick={() => setEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Membership</h2>
            <form onSubmit={handleEditSubmit} className="modal-form">
              <div className="form-group">
                <label>Plan Name</label>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Features (comma separated)</label>
                <textarea
                  name="features"
                  value={editData.features}
                  onChange={handleEditChange}
                  rows="4"
                />
              </div>
              <p className="modal-note">
                Note: Price and duration cannot be changed after creation (Stripe limitation).
              </p>
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-btn"
                  disabled={editLoading}
                >
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="modal-overlay" onClick={() => setDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Delete Membership</h2>
            <p className="delete-warning">
              Are you sure you want to delete this membership plan? This will also deactivate it on Stripe. This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="delete-confirm-btn"
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMembership;
