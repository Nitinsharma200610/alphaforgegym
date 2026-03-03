import { useState } from "react";
import { calculateBMI } from "../services/bmiServices";

const BmiCalculator = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const data = await calculateBMI(height, weight);
      setResult(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <input
          type="number"
          placeholder="Height (cm)"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />

        <input
          type="number"
          placeholder="Weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />

        <button type="submit">Calculate BMI</button>
      </form>

      {result && (
        <div>
          <p>BMI : {result.bmi}</p>
          <p>Category : {result.category}</p>
        </div>
      )}
    </div>
  );
};

export default BmiCalculator;