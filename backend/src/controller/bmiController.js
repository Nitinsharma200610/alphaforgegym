import { calculateBMIService } from "../service/bmiService.js";

export const calculateBMI = (req, res) => {
  try {

    const { height, weight } = req.body;

    if (!height || !weight) {
      return res.status(400).json({
        message: "Height and weight are required"
      });
    }

    const result = calculateBMIService(height, weight);

    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({
      message: "BMI calculation failed"
    });
  }
};