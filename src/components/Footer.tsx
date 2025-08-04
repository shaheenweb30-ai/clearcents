import { Link } from "react-router-dom";
import { DollarSign, Mail, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and tagline */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-navy" />
              </div>
              <span className="font-heading font-bold text-xl">ClearCents</span>
            </Link>
            <p className="text-blue-200 font-body text-lg mb-4">Every cent with purpose.</p>
            <p className="text-blue-300 font-body max-w-md">
              Take control of your money with a simple budgeting tool that works.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/features"
                  className="text-blue-300 hover:text-white font-body transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-blue-300 hover:text-white font-body transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-blue-300 hover:text-white font-body transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-blue-300 hover:text-white font-body transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:hello@clearcents.com"
                  className="text-blue-300 hover:text-white font-body transition-colors flex items-center space-x-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>hello@clearcents.com</span>
                </a>
              </li>
              <li>
                <span className="text-blue-300 font-body">We reply within 24 hours</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-blue-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-300 font-body text-sm">
            © 2024 ClearCents. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-blue-300 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-blue-300 hover:text-white transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;