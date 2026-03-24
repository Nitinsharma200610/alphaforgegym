import React, { useEffect, useState } from "react";
import "../Pages/Home.css";
import Cards from "../Pages/Cards.jsx";
import Membership from "./Membership.jsx";
import Contact from "./Contact.jsx";
import About from "./About.jsx";

const Home = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <>
      <div>
        {/* HERO SECTION */}
        <section className="home" id="home">
          <div className="overlay"></div>

          <div className="home-container">
            <div className="home-content">

              <p>
                Transform your body. Build raw strength. Burn fat.
                Train with elite coaches and modern programs.
              </p>

              <a href={isLoggedIn ? "#" : "/signup"} className="home-btn">
                {isLoggedIn ? "Joined" : "Join Now"}
              </a>

            </div>
          </div>
        </section>

        <Cards />
      </div>

      <Membership />
      <About />
      <Contact />
    </>
  );
};

export default Home;