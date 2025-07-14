import { FiUser, FiBookOpen, FiVideo } from "react-icons/fi";
import { Link } from "react-router";

const HeroBanner = () => {
  return (
    <div className="relative bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-600 text-white min-h-[85vh] flex items-center overflow-hidden">
      {/* Content Wrapper */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 items-center gap-10 py-16">
        {/* Left: Text Content */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Learn. Collaborate. <br />
            Grow with <span className="text-yellow-300">Knowloop</span>
          </h1>
          <p className="text-lg mb-6 max-w-md">
            Your all-in-one platform for collaborative study, real-time
            sessions, shared resources, and educational success.
          </p>
          <div className="flex gap-4">
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
            <Link
              to="/about"
              className="btn btn-outline border-white text-white hover:bg-white hover:text-black"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Right: Floating Info Cards */}
        <div className="relative hidden md:block">
          {/* Card 1: Live Tutors */}
          <div className="absolute -top-50 left-4 bg-white/20 text-white backdrop-blur-lg p-4 rounded-xl shadow-xl w-64 border border-white/30">
            <FiUser className="text-3xl mb-2 text-yellow-300" />
            <h4 className="font-bold text-lg mb-1">Live Tutors</h4>
            <p className="text-sm opacity-90">
              Join sessions with real mentors.
            </p>
          </div>

          {/* Card 2: Shared Notes */}
          <div className="absolute -top-15 right-0 bg-white/20 text-white backdrop-blur-lg p-4 rounded-xl shadow-xl w-64 border border-white/30">
            <FiBookOpen className="text-3xl mb-2 text-green-300" />
            <h4 className="font-bold text-lg mb-1">Shared Notes</h4>
            <p className="text-sm opacity-90">
              Access class notes & resources.
            </p>
          </div>

          {/* Card 3: Recorded Classes */}
          <div className="absolute top-20 left-6 bg-white/20 text-white backdrop-blur-lg p-4 rounded-xl shadow-xl w-64 border border-white/30">
            <FiVideo className="text-3xl mb-2 text-blue-300" />
            <h4 className="font-bold text-lg mb-1">Recorded Classes</h4>
            <p className="text-sm opacity-90">Review sessions anytime.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
