import { useEffect, useState } from "react";
import "./Cards.css";
import { useNavigate } from "react-router-dom";
import { getAllServices } from "../services/serviceService";
import bgImage from "../assets/services-bg.png";

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

  if (loading) {
    return (
      <section
        className="services"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <p style={{ textAlign: "center", color: "#fff", fontSize: "18px" }}>
          Loading services...
        </p>
      </section>
    );
  }

  if (services.length === 0) {
    return (
      <section
        className="services"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <p style={{ textAlign: "center", color: "#fff", fontSize: "18px" }}>
          No services available
        </p>
      </section>
    );
  }

  return (
    <section
      className="services"
    >
      {services.map((service) => (
        <>
      
        <div
          key={service._id}
          className="card"
          onClick={() => handleCardClick(service._id)}
        >
          {service.image && <img src={service.image} alt={service.name} />}
          <h3>{service.name}</h3>
        </div>
         <div
          key={service._id}
          className="card"
          onClick={() => handleCardClick(service._id)}
        >
          {service.image && <img src={service.image} alt={service.name} />}
          <h3>{service.name}</h3>
        </div>
          </>
      ))}
    </section>
  );
};

export default Cards;
