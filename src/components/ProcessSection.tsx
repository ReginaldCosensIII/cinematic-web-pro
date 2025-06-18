
import React from 'react';

const ProcessSection = () => {
  return (
    <section className="relative py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="glass-effect rounded-3xl p-12 animate-fade-in-up">
          <h2 className="text-4xl font-light text-webdev-silver tracking-wide mb-6 text-center">
            My Process
          </h2>
          <h3 className="text-xl font-light text-webdev-soft-gray tracking-wide text-center mb-4">
            Strategic Development Approach
          </h3>
          <p className="text-webdev-soft-gray text-lg tracking-wide max-w-2xl mx-auto text-center leading-relaxed">
            Every project follows a proven methodology combining discovery, design, development, and optimization to ensure exceptional results that exceed expectations.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
