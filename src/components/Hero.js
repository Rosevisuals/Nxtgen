import React from 'react';
import './Hero.css';
function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h2 className="hero-title">
          REVOLUTIONIZING HOSPITAL MANAGEMENT
        </h2>
        <p className="hero-desc">
          Nxt gen simplifies patient records, billing, inventory in one smart system
        </p>
        <a href="/navbar" className="hero-link">Book your appointment</a>
      </div>
    </section>
  );
}

export default Hero;