import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { AdminContentWrapper } from "@/components/admin/AdminContentWrapper";
import { useHomepageContent } from "@/hooks/useHomepageContent";

const Footer = () => {
  const { getContentBySection } = useHomepageContent();
  const footerContent = getContentBySection('footer');

  return (
    <AdminContentWrapper sectionId="footer">
      <footer className="bg-gray-50 text-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
            {/* Logo and tagline */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-3 bg-white rounded-sm"></div>
                </div>
                <span 
                  className="font-heading font-bold text-xl"
                  style={{ color: footerContent?.title_color || '#111827' }}
                >
                  {footerContent?.title || 'FinSuite'}
                </span>
              </div>
              <p 
                className="font-body mb-6 max-w-sm"
                style={{ color: footerContent?.description_color || '#6B7280' }}
              >
                {footerContent?.description || 'Welcome to FinSuite, where financial management meets simplicity and efficiency.'}
              </p>
              
              {/* Social Icons */}
              <div className="flex space-x-3">
                <a href="#" className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-heading font-semibold text-lg text-gray-900 mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/"
                    className="text-gray-600 hover:text-gray-900 font-body transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-gray-600 hover:text-gray-900 font-body transition-colors"
                  >
                    About us
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 font-body transition-colors"
                  >
                    Affiliate Program
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 font-body transition-colors"
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-heading font-semibold text-lg text-gray-900 mb-4">Product</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 font-body transition-colors"
                  >
                    Overview
                  </a>
                </li>
                <li>
                  <Link
                    to="/features"
                    className="text-gray-600 hover:text-gray-900 font-body transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 font-body transition-colors"
                  >
                    Integrations
                  </a>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="text-gray-600 hover:text-gray-900 font-body transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-heading font-semibold text-lg text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 font-body transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 font-body transition-colors"
                  >
                    Podcast
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 font-body transition-colors"
                  >
                    Webinars
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 font-body transition-colors"
                  >
                    Press
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-heading font-semibold text-lg text-gray-900 mb-4">Support</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 font-body transition-colors"
                  >
                    Request a Demo
                  </a>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-gray-600 hover:text-gray-900 font-body transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 font-body transition-colors"
                  >
                    Report a Bug
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p 
              className="font-body text-sm"
              style={{ color: footerContent?.subtitle_color || '#6B7280' }}
            >
              {footerContent?.subtitle || '© 2024 All Rights Reserved'}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-600 hover:text-gray-900 font-body text-sm transition-colors">
                Terms & Conditions
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 font-body text-sm transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </AdminContentWrapper>
  );
};

export default Footer;