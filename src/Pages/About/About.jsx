const About = () => {
  return (
    <section id="about" className="py-20 bg-base-100 text-base-content scroll-mt-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            About <span className="text-primary">Knowloop</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto">
            Knowloop is a modern collaborative study platform designed to connect students and tutors across the globe. Whether you're learning, teaching, or managing — Knowloop gives you the tools to succeed together.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-base-200 rounded-xl shadow-md p-6 text-center">
            <h4 className="font-semibold text-xl mb-2 text-primary">Student Collaboration</h4>
            <p className="text-sm">
              Engage in live sessions, share notes, and build knowledge with fellow learners.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-base-200 rounded-xl shadow-md p-6 text-center">
            <h4 className="font-semibold text-xl mb-2 text-secondary">Tutor Support</h4>
            <p className="text-sm">
              Trusted tutors help guide your journey with expert-led classes and personalized feedback.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-base-200 rounded-xl shadow-md p-6 text-center">
            <h4 className="font-semibold text-xl mb-2 text-accent">Smart Resources</h4>
            <p className="text-sm">
              Access a rich library of resources including recorded sessions, notes, and quizzes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
