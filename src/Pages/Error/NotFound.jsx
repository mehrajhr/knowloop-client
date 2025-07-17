import { Link } from 'react-router';
import { FaArrowLeft } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 text-center p-8">
      <div className="max-w-xl">
        <h1 className="text-7xl font-extrabold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="btn btn-primary text-white gap-2"
        >
          <FaArrowLeft />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
