import { useState, useEffect } from "react";
import {
  createService,
  getAllServices,
  updateService,
  deleteService,
} from "../../services/serviceService";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import "./AdminPages.css";

const AddService = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    features: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [listLoading, setListLoading] = useState(true);

  // Edit modal state
  const [editModal, setEditModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    category: "",
    description: "",
    features: "",
    image: "",
  });
  const [editLoading, setEditLoading] = useState(false);

  // Delete confirmation state
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      // Only fetch services created by this admin
      const data = await getAllServices(user?._id);
      setServices(data.services || []);
    } catch {
      console.error("Failed to fetch services");
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
      await createService(formData);
      toast.success("Service added successfully!");
      setFormData({
        name: "",
        description: "",
        category: "",
        features: "",
        image: "",
      });
      fetchServices();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add service");
    } finally {
      setLoading(false);
    }
  };

  // Edit handlers
  const openEditModal = (service) => {
    setEditId(service._id);
    setEditData({
      name: service.name,
      category: service.category,
      description: service.description,
      features: (service.features || []).join(", "),
      image: service.image || "",
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
      await updateService(editId, editData);
      toast.success("Service updated successfully!");
      setEditModal(false);
      setEditId(null);
      fetchServices();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update service",
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
      await deleteService(deleteId);
      toast.success("Service deleted successfully!");
      setDeleteModal(false);
      setDeleteId(null);
      fetchServices();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete service",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1>Add New Service</h1>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Service Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              required
            />
          </div>

          <div className="form-group">
            <label>Features (comma-separated)</label>
            <textarea
              name="features"
              value={formData.features}
              onChange={handleChange}
              rows="3"
              placeholder="Feature 1, Feature 2, Feature 3"
            />
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <button type="submit" className="admin-btn" disabled={loading}>
            {loading ? "Adding..." : "Add Service"}
          </button>
        </form>

        {/* Services List Table */}
        <h2 style={{ marginTop: "40px" }}>My Services</h2>
        {listLoading ? (
          <p>Loading services...</p>
        ) : (
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Features</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.length > 0 ? (
                  services.map((s) => (
                    <tr key={s._id}>
                      <td>{s.name}</td>
                      <td>{s.category}</td>
                      <td>{s.description?.substring(0, 60)}...</td>
                      <td>{(s.features || []).join(", ") || "—"}</td>
                      <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="action-btns">
                          <button
                            className="edit-btn"
                            onClick={() => openEditModal(s)}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => openDeleteModal(s._id)}
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
                      No services found
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
            <h2>Edit Service</h2>
            <form onSubmit={handleEditSubmit} className="modal-form">
              <div className="form-group">
                <label>Service Name</label>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  name="category"
                  value={editData.category}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={editData.description}
                  onChange={handleEditChange}
                  rows="4"
                  required
                />
              </div>
              <div className="form-group">
                <label>Features (comma separated)</label>
                <textarea
                  name="features"
                  value={editData.features}
                  onChange={handleEditChange}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={editData.image}
                  onChange={handleEditChange}
                />
              </div>
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
            <h2>Delete Service</h2>
            <p className="delete-warning">
              Are you sure you want to delete this service? This action cannot be undone.
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

export default AddService;
