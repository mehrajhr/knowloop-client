import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBookOpen,
  FaGlobe,
} from "react-icons/fa";

const PlatformStats = () => {
  return (
    <section className="bg-base-200 py-16 text-center">
      <h2 className="text-3xl font-bold mb-10">Knowloop in Numbers</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto px-6">
        <div className="p-6 bg-base-100 rounded-xl shadow">
          <FaUserGraduate className="text-3xl text-primary mb-2 mx-auto" />
          <h3 className="text-xl font-bold">2,500+</h3>
          <p>Active Students</p>
        </div>
        <div className="p-6 bg-base-100 rounded-xl shadow">
          <FaChalkboardTeacher className="text-3xl text-secondary mb-2 mx-auto" />
          <h3 className="text-xl font-bold">180+</h3>
          <p>Verified Tutors</p>
        </div>
        <div className="p-6 bg-base-100 rounded-xl shadow">
          <FaBookOpen className="text-3xl text-accent mb-2 mx-auto" />
          <h3 className="text-xl font-bold">3,200+</h3>
          <p>Shared Resources</p>
        </div>
        <div className="p-6 bg-base-100 rounded-xl shadow">
          <FaGlobe className="text-3xl text-info mb-2 mx-auto" />
          <h3 className="text-xl font-bold">12+</h3>
          <p>Countries Reached</p>
        </div>
      </div>
    </section>
  );
};

export default PlatformStats;
