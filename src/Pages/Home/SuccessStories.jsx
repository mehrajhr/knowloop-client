import { FaQuoteLeft } from "react-icons/fa";

const SuccessStories = () => {
  const stories = [
    {
      name: "Afsana Rahman",
      role: "Student, Dhaka",
      story:
        "Knowloop helped me pass my board exams with confidence. The live sessions were a game changer!",
    },
    {
      name: "Tanvir Hossain",
      role: "Tutor, Rajshahi",
      story:
        "I found passionate students and consistent earnings through Knowloop — truly empowering.",
    },
    {
      name: "Ruma Akter",
      role: "Student, Chattogram",
      story:
        "From shared notes to recorded sessions, everything is organized and effective.",
    },
  ];

  return (
    <section className="bg-base-100 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Success Stories
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {stories.map((item, i) => (
            <div key={i} className="bg-base-200 p-6 rounded-xl shadow">
              <FaQuoteLeft className="text-3xl text-primary mb-4" />
              <p className="mb-4 italic">“{item.story}”</p>
              <h4 className="font-bold">{item.name}</h4>
              <p className="text-sm text-gray-500">{item.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
