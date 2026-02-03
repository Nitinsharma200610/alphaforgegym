import "./About.css";
import aboutBg from "../assets/about-bg.png";


const About = () => {
  return (
    <section
      className="about-section"
      style={{ backgroundImage: `url(${aboutBg})` }}
    >
      <div className="about-overlay">
        <h2 className="about-title">ABOUT ALPHAFORGE</h2>

        <p className="about-desc">
          AlphaForge Gym is built for warriors. We focus on raw strength,
          fat loss, and elite performance using modern equipment and
          expert coaching.
        </p>

        <div className="about-cards">
          <div className="about-card">
            <h3>01</h3>
            <p>Elite Coaches</p>
          </div>

          <div className="about-card">
            <h3>02</h3>
            <p>Affordable Plans</p>
          </div>

          <div className="about-card">
            <h3>03</h3>
            <p>Modern Equipment</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
