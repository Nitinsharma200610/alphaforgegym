import { useState, useEffect } from "react";
import { createService, getAllServices } from "../../services/serviceService";
import toast from "react-hot-toast";
import "./AdminPages.css";

const AddService = () => {
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

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await getAllServices();
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
      fetchServices(); // Refresh list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add service");
    } finally {
      setLoading(false);
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
        <h2 style={{ marginTop: "40px" }}>All Services</h2>
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No services found
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

export default AddService;
