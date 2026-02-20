import { useState } from "react";
import "./contact.css";
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { Instagram, Facebook, MessageCircleMore } from "lucide-react";
import { submitContact } from "../services/contactService";
import toast from "react-hot-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitContact(formData);
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-section">
      <div className="contact-overlay">

        <h2 className="contact-title">CONTACT US</h2>
        <p className="contact-subtitle">
          Get in touch with AlphaForge Gym for any inquiries or assistance.
          We're here to help you achieve your fitness goals.
        </p>

        <div className="contact-wrapper">

          {/* LEFT CARD */}
          <div className="contact-info contact-card">

            <div className="info-item">
              <FaMapMarkerAlt className="info-icon" />
              <div>
                <h4>Location</h4>
                <p>123 Fitness Street, Iron City, India</p>
              </div>
            </div>

            <div className="info-item">
              <FaEnvelope className="info-icon" />
              <div>
                <h4>Email</h4>
                <p>info@alphaforgegym.com</p>
              </div>
            </div>

            <div className="info-item">
              <FaPhoneAlt className="info-icon" />
              <div>
                <h4>Phone</h4>
                <p>+91 93176 25636</p>
              </div>
            </div>

            {/* SOCIAL ICONS */}
            <div className="icons-social">
              <a
                href="https://www.instagram.com/alphaforgegym?igsh=MW81YzUxbW55ZHNobg=="
                target="_blank"
                rel="noreferrer"
              >
                <Instagram style={{ color: "#f401eb", cursor: "pointer" }} />
              </a>

              <a
                href="https://www.facebook.com/alphaforgegym"
                target="_blank"
                rel="noreferrer"
              >
                <Facebook style={{ color: "#7b61ff", cursor: "pointer" }} />
              </a>

              <a
                href="https://wa.me/+91 93176 25636"
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircleMore
                  style={{ color: "#39e736", cursor: "pointer" }}
                />
              </a>
            </div>
          </div>

          {/* RIGHT CARD */}
          <form className="contact-form contact-card" onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                />
              </div>

              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Your Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                placeholder="Type your message"
                required
              ></textarea>
            </div>

            <button type="submit" className="contact-btn" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>

          </form>

        </div>

      </div>
    </section>
  );
};

export default Contact;
