import { useEffect, useState } from "react";
import "./Cards.css";
import { useNavigate } from "react-router-dom";
import { getAllServices } from "../services/serviceService";

const Cards = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await getAllServices();
      setServices(data.services || []);
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (id) => {
    navigate(`/services/${id}`);
  };



  // Group services by admin/gym name
  const groupedServices = services.reduce((groups, service) => {
    const gymName = service.createdBy?.name || "Other";
    if (!groups[gymName]) {
      groups[gymName] = [];
    }
    groups[gymName].push(service);
    return groups;
  }, {});

  if (loading) {
    return (
      <section className="services">
        <p style={{ textAlign: "center", color: "#fff", fontSize: "18px" }}>
          Loading services...
        </p>
      </section>
    );
  }

  if (services.length === 0) {
    return (
      <section className="services">
        <p style={{ textAlign: "center", color: "#fff", fontSize: "18px" }}>
          No services available
        </p>
      </section>
    );
  }

  return (
    <section className="services">
      {Object.entries(groupedServices).map(([gymName, gymServices]) => (
        <div key={gymName} className="gym-service-group">
          <div className="gym-service-header">
            <div className="gym-service-icon">🏋️</div>
            <h2 className="gym-service-name">{gymName}</h2>
          </div>
          <div className="cards-grid">
            {gymServices.map((service) => (
              <div
                key={service._id}
                className="card"
                onClick={() => handleCardClick(service._id)}
              >
                {service.image && <img src={service.image} alt={service.name} />}
                <h3>{service.name}</h3>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default Cards;
