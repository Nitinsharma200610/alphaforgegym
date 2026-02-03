import React from "react";
import { useParams, useNavigate } from "react-router-dom";


// 🔹 Reuse same images from Cards
import physicalImg from "../assets/physical.png";
import weight from "../assets/Weight.png";
import strength from "../assets/Strength.png";
import weightlift from "../assets/weightLf.png";
import fat from "../assets/Fat.png";

const servicesData = {
  "physical-fitness": {
    title: "Physical Fitness",
    image: physicalImg,
    description:
      "Build stamina, flexibility, endurance, and overall body performance with expert-guided physical fitness programs.",
    points: [
      "Full Body Conditioning",
      "Improved Mobility",
      "Cardio + Strength Balance",
      "Personalized Training Plans",
    ],
  },
  "weight-gain": {
    title: "Weight Gain",
    image: weight,
    description:
      "Healthy and sustainable weight gain programs focused on muscle growth and proper nutrition.",
    points: [
      "Muscle Mass Development",
      "High-Calorie Diet Plans",
      "Progressive Training",
      "Supplement Guidance",
    ],
  },
  "strength-training": {
    title: "Strength Training",
    image: strength,
    description:
      "Advanced strength training routines designed to increase power and performance.",
    points: [
      "Compound Movements",
      "Progressive Overload",
      "Expert Coaching",
      "Performance Tracking",
    ],
  },
  "weightlifting": {
    title: "Weightlifting",
    image: weightlift,
    description:
      "Professional weightlifting programs for serious lifters and athletes.",
    points: [
      "Olympic Lifts",
      "Technique Improvement",
      "Strength Cycles",
      "Competition Prep",
    ],
  },
  "fat-loss": {
    title: "Fat Loss",
    image: fat,
    description:
      "Scientifically designed fat loss programs to burn calories and get lean.",
    points: [
      "HIIT & Cardio",
      "Fat Burning Workouts",
      "Nutrition Guidance",
      "Body Transformation",
    ],
  },
};

const ServicesDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const service = servicesData[id];

  if (!service) {
    return <h2 style={{ padding: "100px" }}>Service Not Found</h2>;
  }

  return (
    <section className="service-detail">
      {/* 🔙 Back Button */}
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back to Home
      </button>

      {/* 🔥 Hero Section */}
      <div className="service-hero">
        <div className="service-text">
          <h1>{service.title}</h1>
          <p>{service.description}</p>
        </div>

        <div className="service-image">
          <img src={service.image} alt={service.title} />
        </div>
      </div>

      {/* ⭐ Features */}
      <div className="service-features">
        <h2>What You’ll Get</h2>
        <div className="features-grid">
          {service.points.map((point, index) => (
            <div key={index} className="feature-card">
              {point}
            </div>
          ))}
        </div>
      </div>

      {/* 🚀 CTA */}
      <div className="service-cta">
        <h2>Ready to Transform Your Body?</h2>
        <button onClick={() => navigate("/membership")}>
          Join Now
        </button>
      </div>
    </section>
  );
};

export default ServicesDetails;
