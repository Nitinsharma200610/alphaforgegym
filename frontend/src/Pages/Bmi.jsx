import React, { useState } from "react";
import "./Bmi.css";

const Bmi = () => {
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [status, setStatus] = useState("");
  const [angle, setAngle] = useState(-90);

  const getStatus = (bmiValue) => {
    if (bmiValue < 18.5) return "Underweight";
    if (bmiValue < 25) return "Normal";
    if (bmiValue < 30) return "Overweight";
    return "Obese";
  };

  const calculateBMI = () => {
    if (!height || !weight || !age) return;

    const h = height / 100;
    const bmiValue = (weight / (h * h)).toFixed(1);
    setBmi(bmiValue);

    setStatus(getStatus(bmiValue));

    // Accurate 180° mapping (BMI range 10 - 40)
    const minBMI = 10;
    const maxBMI = 40;
    const limitedBMI = Math.min(Math.max(bmiValue, minBMI), maxBMI);
    const calculatedAngle =
      ((limitedBMI - minBMI) / (maxBMI - minBMI)) * 180 - 90;

    setAngle(calculatedAngle);
  };

  return (
    <div className="bmi-wrapper">
      <div className="bmi-card">
        <h1>BMI Calculator</h1>

        {/* Gender Buttons */}
        <div className="gender-toggle">
          <button
            className={gender === "male" ? "active" : ""}
            onClick={() => setGender("male")}
          >
            Male
          </button>
          <button
            className={gender === "female" ? "active" : ""}
            onClick={() => setGender("female")}
          >
            Female
          </button>
        </div>

        {/* Age */}
        <div className="input-box">
          <label>Age</label>
          <input
            type="number"
            placeholder="Enter age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>

        {/* Height */}
        <div className="input-box">
          <label>Height (cm)</label>
          <input
            type="number"
            placeholder="Enter height in cm"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </div>

        {/* Weight */}
        <div className="input-box">
          <label>Weight (kg)</label>
          <input
            type="number"
            placeholder="Enter weight in kg"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>

        <button className="bmi-btn" onClick={calculateBMI}>
          Calculate BMI
        </button>

        {bmi && (
          <>
            <div className="result">
              <h3>Your BMI</h3>
              <h2>{bmi}</h2>
              <p className={`status ${status.toLowerCase()}`}>
                {status}
              </p>
            </div>

            {/* Gauge */}
            <div className="gauge-wrapper">
  <div className="gauge">
    <div className="gauge-arc"></div>

    <div
      className="needle"
      style={{ transform: `rotate(${angle}deg)` }}
    ></div>

    <div className="gauge-center">
      <p>BMI</p>
      <h2>{bmi}</h2>
    </div>
  </div>

  <div className="gauge-numbers">
    <span style={{ left: "0%" }}>16</span>
    <span style={{ left: "25%" }}>18.5</span>
    <span style={{ left: "50%" }}>25</span>
    <span style={{ left: "100%" }}>40</span>
  </div>
</div>
          </>
        )}
      </div>
    </div>
  );
};

export default Bmi;