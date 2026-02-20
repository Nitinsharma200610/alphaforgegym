import Contact from "../models/contact.model.js";
import asyncHandler from "express-async-handler";

// Public: Submit a contact message
export const createContact = asyncHandler(async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const contact = await Contact.create({ name, email, subject, message });

    return res.status(201).json({
        message: "Message sent successfully! We'll get back to you soon.",
        contact,
    });
});

// SuperAdmin: Get all contact messages
export const getAllContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return res.json({ contacts });
});

// SuperAdmin: Mark a message as read
export const markAsRead = asyncHandler(async (req, res) => {
    const contact = await Contact.findByIdAndUpdate(
        req.params.id,
        { isRead: true },
        { new: true },
    );

    if (!contact) {
        return res.status(404).json({ message: "Contact message not found" });
    }

    return res.json({ message: "Marked as read", contact });
});

// SuperAdmin: Delete a contact message
export const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
        return res.status(404).json({ message: "Contact message not found" });
    }

    return res.json({ message: "Contact message deleted" });
});
