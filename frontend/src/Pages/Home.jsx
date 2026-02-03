
import React from "react";
import "../Pages/Home.css";
import "../Pages/Cards.jsx";
import Cards from "../Pages/Cards.jsx";
import Membership from "./Membership.jsx";
import Contact from "./Contact.jsx";
import About from "./About.jsx";

const Home = () => {
  return (
    <>
  
    <div>{/* HERO SECTION */}
      <section className="home" id="home">
        <div className="overlay"></div>

        <div className="home-container">
          {/* LEFT CONTENT */}
          <div className="home-content">


            <p>
              Transform your body. Build raw strength. Burn fat.
              Train with elite coaches and modern programs.
            </p>


            <a href="/signup" className="home-btn">
              Join Now
            </a>
          </div>


        </div>
      </section>
      <Cards /></div>

      {/*  membership */}
      <Membership/>


      {/* About */}
      <About/>


      {/*  contact */}
    

        <Contact/>
  </>

  );
};

export default Home;
