import React from 'react';

const HeroSection = () => {
  return (
    <section className="bg-teal-50 py-20 text-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-teal-900 tracking-tight mb-6">
          Welcome to Sciencelet Bioinformatics Lab
        </h1>
        <p className="text-xl text-teal-700 max-w-3xl mx-auto mb-10">
          Pioneering computational methods for biological data analysis and discovery.
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-teal-600 text-white px-8 py-3 rounded-md font-medium hover:bg-teal-700 transition-colors">
            Get Started
          </button>
          <button className="bg-white text-teal-700 border border-teal-300 px-8 py-3 rounded-md font-medium hover:bg-teal-50 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
