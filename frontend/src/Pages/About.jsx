import "./About.css";

export default function About() {
  return (
    <section className="about-section">
      <div className="about-overlay">

        <h1 className="about-title">ABOUT ALPHAFORGE</h1>

        <p className="about-subtitle">
          AlphaForge Gym is built for warriors. We focus on raw strength, fat loss,
          and elite performance using modern equipment and expert coaching.
        </p>

        <div className="about-cards">

          <div className="about-card">
            <span className="card-no">01</span>
            <div className="card-icon">💪</div>
            <h3>Elite Coaches</h3>
            <p>
              Train with certified and experienced coaches dedicated to your
              fitness success.
            </p>
          </div>

          <div className="about-card">
            <span className="card-no">02</span>
            <div className="card-icon">💰</div>
            <h3>Affordable Plans</h3>
            <p>
              Flexible membership plans that fit your goals and your budget.
            </p>
          </div>

          <div className="about-card">
            <span className="card-no">03</span>
            <div className="card-icon">🏋️</div>
            <h3>Modern Equipment</h3>
            <p>
              Latest machines and tools for safe and effective training.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
