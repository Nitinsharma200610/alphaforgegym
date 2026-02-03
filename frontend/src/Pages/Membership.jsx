import "./Membership.css";
import membershipBg from "../assets/membership-bg.png";

const Membership = () => {
  return (
    <section
      className="membership"
      style={{ backgroundImage: `url(${membershipBg})` }}
    >
      <h1 className="membership-title">MEMBERSHIP PLANS</h1>

      <div className="plans">
        {/* BASIC */}
        <div className="plan-card">
          <h2>Basic</h2>
          <p className="price">₹1,999 <span>/month</span></p>
          <ul>
            <li>Gym Access</li>
            <li>Certified Trainers</li>
            <li>Standard Classes</li>
            <li>Basic Equipment</li>
          </ul>
          <button>Choose Plan</button>
        </div>

        {/* ADVANCED */}
        <div className="plan-card popular">
          <h2>Advanced</h2>
          <p className="price">₹2,999 <span>/month</span></p>
          <ul>
            <li>Gym Access</li>
            <li>Certified Trainers</li>
            <li>Advanced Classes</li>
            <li>Full Equipment</li>
            <li>Personalized Plans</li>
          </ul>
          <button>Choose Plan</button>
        </div>

        {/* ELITE */}
        <div className="plan-card elite">
          <h2>Elite</h2>
          <p className="price">₹4,999 <span>/month</span></p>
          <ul>
            <li>All Advanced Features</li>
            <li>1-on-1 Personal Training</li>
            <li>Exclusive Classes</li>
            <li>Full Nutrition Support</li>
            <li>Customized Programs</li>
          </ul>
          <button>Choose Plan</button>
        </div>
      </div>
    </section>
  );
};

export default Membership;
