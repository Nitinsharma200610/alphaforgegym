import "./contact.css";
import contactBg from "../assets/contact-bg.png";

const Contact = () => {
  return (
    <section
      className="why-section"
      style={{ backgroundImage: `url(${contactBg})` }}
    >
      <div className="why-container">

        {/* LEFT CONTENT */}
        <div className="why-left">
          <h2>Why Choose Us?</h2>

          <h3>Our Trainer</h3>

          <div className="trainer-cards">
            <div className="trainer-card"></div>
            <div className="trainer-card"></div>
            <div className="trainer-card"></div>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="why-right"></div>

      </div>

      {/* FOOTER CONTACT */}
      <div className="why-footer">
        <div>📞 +91 98765 43210</div>
        <div>✉️ info@alphaforgegym.com</div>
        <div>📍 123 Fitness St, Iron City</div>

        <div className="socials">
          <i className="fab fa-facebook-f"></i>
          <i className="fab fa-instagram"></i>
          <i className="fab fa-twitter"></i>
        </div>
      </div>
    </section>
  );
};

export default Contact;
