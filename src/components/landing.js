import React from 'react';
import HealthServices from './HealthServices';
import Hero from './Hero';
import Features from './Features';
import Navbar from './navbar';
const Landing = () => {
  return (
    <div>
      <Navbar />
    <Hero />
    <Features />
    <HealthServices />
    </div>
  );
};

export default Landing;