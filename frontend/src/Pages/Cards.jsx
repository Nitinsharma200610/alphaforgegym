import "./Cards.css";
import { useNavigate } from "react-router-dom";

import physicalImg from "../assets/physical.png";
import weight from "../assets/Weight.png";
import strength from "../assets/Strength.png";
import weightlift from "../assets/weightLf.png";
import fat from "../assets/Fat.png";
import bgImage from "../assets/services-bg.png";

const Cards = () => {
  const navigate = useNavigate();

  // 🔹 Cards Data (Dynamic + Reusable)
  const cardsData = [
    {
      id: "physical-fitness",
      title: "Physical Fitness",
      image: physicalImg,
    },
    {
      id: "weight-gain",
      title: "Weight Gain",
      image: weight,
    },
    {
      id: "strength-training",
      title: "Strength Training",
      image: strength,
    },
    {
      id: "weightlifting",
      title: "Weightlifting",
      image: weightlift,
    },
    {
      id: "fat-loss",
      title: "Fat Loss",
      image: fat,
    },
  ];

  // 🔹 Click Handler (Route will be set later in App.jsx)
  const handleCardClick = (id) => {
    console.log("running")
    navigate(`/services/${id}`);
  };

  return (
    <section
      className="services"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {cardsData.map((card) => (
        <div
          key={card.id}
          className="card"
          onClick={() => handleCardClick(card.id)}
        >
          <img src={card.image} alt={card.title} />
          <h3>{card.title}</h3>
        </div>
      ))}
    </section>
  );
};

export default Cards;
