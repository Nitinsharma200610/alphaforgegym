import axios from "axios";

export const calculateBMI = async (height, weight) => {
  const res = await axios.post("http://localhost:5000/api/bmi", {
    height,
    weight,
  });

  return res.data;
};