import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const WhyChooseKnowloop = () => {
  return (
    <section className="bg-base-200 py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Why Choose Knowloop?</h2>
        <p className="mb-10 text-lg max-w-2xl mx-auto">
          Discover the features that make Knowloop the smartest study partner
          for students and educators.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            "Collaborative Sessions",
            "Secure & Private",
            "Tutor Verified",
            "24/7 Access",
            "Resource Sharing",
            "Progress Tracking",
          ].map((item, i) => (
            <div
              key={i}
              className="bg-base-100 p-6 rounded-xl shadow text-left"
            >
              <FaCheckCircle className="text-primary text-2xl mb-2" />
              <h4 className="font-semibold text-lg">{item}</h4>
              <p className="text-sm mt-1">
                Experience learning in a whole new way with powerful tools that
                support real results.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseKnowloop;
