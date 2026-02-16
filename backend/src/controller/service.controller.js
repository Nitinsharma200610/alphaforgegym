import Service from "../models/service.model.js";
import asyncHandler from "express-async-handler";

export const createService = asyncHandler(async (req, res) => {
  const { name, category, description, features, image } = req.body;

  if (!name || !category || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const featuresList =
    typeof features === "string"
      ? features.split(",").map((f) => f.trim())
      : features || [];

  const service = await Service.create({
    name,
    category,
    description,
    features: featuresList,
    image,
    createdBy: req.user._id,
  });

  return res.status(201).json({
    message: "Service created successfully",
    service,
  });
});

export const getAllServices = asyncHandler(async (req, res) => {
  const filter = { isActive: true };
  if (req.query.createdBy) {
    filter.createdBy = req.query.createdBy;
  }
  const services = await Service.find(filter)
    .populate("createdBy", "name")
    .sort({ createdAt: -1 });
  return res.json({ services });
});

export const getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }
  return res.json({ service });
});

export const updateService = asyncHandler(async (req, res) => {
  const { name, category, description, features, image } = req.body;
  const service = await Service.findById(req.params.id);

  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }

  if (name) service.name = name;
  if (category) service.category = category;
  if (description) service.description = description;
  if (features) {
    service.features =
      typeof features === "string"
        ? features.split(",").map((f) => f.trim())
        : features;
  }
  if (image) service.image = image;

  await service.save();

  return res.json({
    message: "Service updated successfully",
    service,
  });
});

export const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }

  service.isActive = false;
  await service.save();

  return res.json({ message: "Service deleted successfully" });
});
