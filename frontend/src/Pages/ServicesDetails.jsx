import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getServiceById } from "../services/serviceService";
import { useAuth } from "../hooks/useAuth";

const ServicesDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasMembership } = useAuth();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const data = await getServiceById(id);
      setService(data.service);
    } catch (err) {
      setError("Service not found");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <h2 style={{ padding: "100px", textAlign: "center" }}>Loading...</h2>
    );
  }

  if (error || !service) {
    return (
      <h2 style={{ padding: "100px", textAlign: "center" }}>
        Service Not Found
      </h2>
    );
  }

  return (
    <section className="service-detail">
      {/* 🔙 Back Button */}
      <button className="back-btn" onClick={() => navigate("/cards")}>
        ← Back to Services
      </button>

      {/* 🔥 Hero Section */}
      <div className="service-hero">
        <div className="service-text">
          <h1>{service.name}</h1>
          <p>{service.description}</p>
          {service.category && (
            <span className="service-category">{service.category}</span>
          )}
        </div>

        {service.image && (
          <div className="service-image">
            <img src={service.image} alt={service.name} />
          </div>
        )}
      </div>

      {/* ⭐ Features */}
      {service.features && service.features.length > 0 && (
        <div className="service-features">
          <h2>What You'll Get</h2>
          <div className="features-grid">
            {service.features.map((feature, index) => (
              <div key={index} className="feature-card">
                {feature}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🚀 CTA */}
      {!hasMembership && (
        <div className="service-cta">
          <h2>Ready to Transform Your Body?</h2>
          <button onClick={() => navigate("/membership")}>Join Now</button>
        </div>
      )}
    </section>
  );
};

export default ServicesDetails;
