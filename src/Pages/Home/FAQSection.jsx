import { useState } from "react";

const FAQSection = () => {
  const [faqs, setFaqs] = useState([
    {
      question: "Is Knowloop free to use?",
      answer: "Yes! Most core features are free for students and tutors.",
      open: true,
    },
    {
      question: "How do I become a tutor?",
      answer: "Register, complete your profile, and apply via the dashboard.",
      open: false,
    },
    {
      question: "Can I upload my own resources?",
      answer: "Yes, you can share notes, videos, and links directly.",
      open: false,
    },
  ]);

  const toggleFAQ = (index) => {
    setFaqs((prev) =>
      prev.map((faq, i) => ({ ...faq, open: i === index ? !faq.open : false }))
    );
  };

  return (
    <section className="bg-base-100 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="collapse collapse-arrow border border-base-300 rounded-box"
            >
              <input
                type="checkbox"
                checked={faq.open}
                onChange={() => toggleFAQ(index)}
              />
              <div className="collapse-title text-lg font-medium">
                {faq.question}
              </div>
              <div className="collapse-content">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
