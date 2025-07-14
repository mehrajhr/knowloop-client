import { Link } from 'react-router';
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content pt-10 pb-6 border-t border-base-300 mt-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold mb-2 text-primary">Knowloop</h2>
          <p className="text-sm">
            Empowering students and tutors through smart collaboration and shared learning.
          </p>
          <div className="flex mt-4 gap-4 text-xl">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-primary">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-primary">
              <FaTwitter />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-primary">
              <FaLinkedin />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-primary">
              <FaGithub />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="footer-title">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link to="/" className="link link-hover">Home</Link></li>
            <li><Link to="/about" className="link link-hover">About</Link></li> {/* in-page scroll */}
            <li><Link to="/login" className="link link-hover">Login</Link></li>
            <li><Link to="/register" className="link link-hover">Register</Link></li>
          </ul>
        </div>

        {/* Features */}
        <div>
          <h4 className="footer-title">Features</h4>
          <ul className="space-y-2">
            <li><Link  className="link link-hover">Live Sessions</Link></li>
            <li><Link  className="link link-hover">Shared Resources</Link></li>
            <li><Link  className="link link-hover">Top Tutors</Link></li>
            <li><Link  className="link link-hover">Dashboard</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="footer-title">Contact</h4>
          <p className="text-sm">Email: support@knowloop.com</p>
          <p className="text-sm">Phone: +880 1234-567890</p>
          <p className="text-sm">Location: Dhaka, Bangladesh</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-base-300 pt-4 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Knowloop. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
