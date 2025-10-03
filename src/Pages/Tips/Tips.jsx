import React from "react";
import { FaLightbulb } from "react-icons/fa";

const tipsData = [
  {
    title: "Time Management",
    description:
      "Plan your study schedule and stick to it consistently for better results.",
  },
  {
    title: "Active Learning",
    description:
      "Engage actively with materials: take notes, ask questions, and summarize key points.",
  },
  {
    title: "Regular Breaks",
    description:
      "Take short breaks to refresh your mind; avoid long continuous study hours.",
  },
  {
    title: "Group Study",
    description:
      "Discussing topics with peers can help you understand difficult concepts faster.",
  },
];

const Tips = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-8 flex items-center justify-center gap-2">
        <FaLightbulb className="text-yellow-500" /> Study Tips
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {tipsData.map((tip, index) => (
          <div
            key={index}
            className="p-6 border rounded-xl shadow hover:shadow-lg transition-all bg-white"
          >
            <h2 className="text-2xl font-semibold mb-2">{tip.title}</h2>
            <p className="text-gray-600">{tip.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tips;
