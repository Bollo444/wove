'use client';

import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'Explore Stories', href: '/explore' },
      { name: 'Create Story', href: '/create' },
      { name: 'How It Works', href: '/how-it-works' },
      { name: 'Community Guidelines', href: '/guidelines' },
    ],

    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Report Content', href: '/report' },
      { name: 'Feedback', href: '/feedback' },
    ],

    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Safety Center', href: '/safety' },
    ],

    company: [
      { name: 'About Wove', href: '/about' },
      { name: 'Our Mission', href: '/mission' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press Kit', href: '/press' },
    ],
  };

  const socialLinks = [
    {
      name: 'Twitter',
      href: 'https://twitter.com/wove',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" data-oid="rokuxta">
          <path
            d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
            data-oid="zb094-8"
          />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/wove',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" data-oid="aa-48xt">
          <path
            fillRule="evenodd"
            d="M12.017 0C8.396 0 7.989.013 7.041.048 6.094.082 5.52.204 5.036.388a5.918 5.918 0 00-2.14 1.393A5.918 5.918 0 00.388 4.036C.204 4.52.082 5.094.048 6.041.013 6.989 0 7.396 0 11.017c0 3.621.013 4.028.048 4.976.034.947.156 1.521.34 2.005a5.918 5.918 0 001.393 2.14 5.918 5.918 0 002.14 1.393c.484.184 1.058.306 2.005.34.948.035 1.355.048 4.976.048 3.621 0 4.028-.013 4.976-.048.947-.034 1.521-.156 2.005-.34a5.918 5.918 0 002.14-1.393 5.918 5.918 0 001.393-2.14c.184-.484.306-1.058.34-2.005.035-.948.048-1.355.048-4.976 0-3.621-.013-4.028-.048-4.976-.034-.947-.156-1.521-.34-2.005a5.918 5.918 0 00-1.393-2.14A5.918 5.918 0 0018.982.388C18.498.204 17.924.082 16.977.048 16.029.013 15.622 0 12.001 0h.016zm-.117 2.164c3.573 0 3.993.014 5.402.08.947.034 1.462.156 1.805.26.454.176.778.387 1.12.73.343.343.554.667.73 1.12.104.343.226.858.26 1.805.066 1.409.08 1.829.08 5.402 0 3.573-.014 3.993-.08 5.402-.034.947-.156 1.462-.26 1.805a3.016 3.016 0 01-.73 1.12 3.016 3.016 0 01-1.12.73c-.343.104-.858.226-1.805.26-1.409.066-1.829.08-5.402.08-3.573 0-3.993-.014-5.402-.08-.947-.034-1.462-.156-1.805-.26a3.016 3.016 0 01-1.12-.73 3.016 3.016 0 01-.73-1.12c-.104-.343-.226-.858-.26-1.805-.066-1.409-.08-1.829-.08-5.402 0-3.573.014-3.993.08-5.402.034-.947.156-1.462.26-1.805.176-.454.387-.778.73-1.12.343-.343.667-.554 1.12-.73.343-.104.858-.226 1.805-.26 1.409-.066 1.829-.08 5.402-.08z"
            clipRule="evenodd"
            data-oid="a56bjm1"
          />
          <path
            fillRule="evenodd"
            d="M12.017 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12.017 16a4 4 0 110-8 4 4 0 010 8z"
            clipRule="evenodd"
            data-oid="i0h.dlu"
          />
          <circle cx="18.406" cy="5.594" r="1.44" data-oid="c69gr_b" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com/wove',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" data-oid="i-6_x_x">
          <path
            d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
            data-oid="6kjilpf"
          />
        </svg>
      ),
    },
    {
      name: 'Discord',
      href: 'https://discord.gg/wove',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" data-oid="wv2-5-i">
          <path
            d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"
            data-oid="o922sk8"
          />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto" data-oid="h._856y">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" data-oid="k192lrq">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8" data-oid="_v4z0-u">
          {/* Brand Section */}
          <div className="lg:col-span-2" data-oid="06vo1j_">
            <div className="flex items-center mb-4" data-oid="lxtt97d">
              <div
                className="h-8 w-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center"
                data-oid="-vpt..7"
              >
                <span className="text-white font-bold text-lg" data-oid="enjcv-5">
                  W
                </span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900" data-oid="swkuor1">
                Wove
              </span>
            </div>
            <p className="text-gray-600 mb-6 max-w-md" data-oid="ojmx2wo">
              Empowering young minds to create, share, and discover amazing stories. Join our
              community of storytellers and let your imagination soar.
            </p>

            {/* Newsletter Signup */}
            <div className="mb-6" data-oid="ftl4m7l">
              <h4 className="text-sm font-semibold text-gray-900 mb-2" data-oid="-5g733q">
                Stay Updated
              </h4>
              <div className="flex max-w-md" data-oid="l.4mzn4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  data-oid="q5yayhg"
                />

                <button
                  className="px-4 py-2 bg-purple-600 text-white rounded-r-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  data-oid="ypja:q4"
                >
                  Subscribe
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div data-oid="kud7jnl">
              <h4 className="text-sm font-semibold text-gray-900 mb-3" data-oid="8-h..cg">
                Follow Us
              </h4>
              <div className="flex space-x-4" data-oid="ka_1bgk">
                {socialLinks.map(social => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-purple-600 transition-colors"
                    aria-label={social.name}
                    data-oid="rxvjc51"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div data-oid="pxa.lmf">
            <h3
              className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4"
              data-oid="ihvfu:v"
            >
              Platform
            </h3>
            <ul className="space-y-3" data-oid="b_nwm4f">
              {footerLinks.platform.map(link => (
                <li key={link.name} data-oid="jhp9e7k">
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
                    data-oid="v7qux3k"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div data-oid="b.sucgw">
            <h3
              className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4"
              data-oid="my3fny-"
            >
              Support
            </h3>
            <ul className="space-y-3" data-oid="nzwnfzu">
              {footerLinks.support.map(link => (
                <li key={link.name} data-oid="78tci-i">
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
                    data-oid="l0y26up"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Company Links */}
          <div data-oid="963gkbx">
            <h3
              className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4"
              data-oid="_8fx-w7"
            >
              Legal
            </h3>
            <ul className="space-y-3 mb-6" data-oid="0e-wgk8">
              {footerLinks.legal.map(link => (
                <li key={link.name} data-oid="kken459">
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
                    data-oid="2:2i2.p"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h3
              className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4"
              data-oid="6n-lu4."
            >
              Company
            </h3>
            <ul className="space-y-3" data-oid=".vc147t">
              {footerLinks.company.map(link => (
                <li key={link.name} data-oid="n7eab86">
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
                    data-oid="bnara-m"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-gray-50" data-oid="i.vq2zx">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" data-oid="u.slmtz">
          <div
            className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
            data-oid="rw9dylm"
          >
            <div
              className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6"
              data-oid="xu9zvcy"
            >
              <p className="text-sm text-gray-500" data-oid="8om31y2">
                © {currentYear} Wove. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 text-xs text-gray-400" data-oid="fyhzy5i">
                <span data-oid=":_qmbxz">Made with ❤️ for young storytellers</span>
                <span data-oid="r59zoe4">•</span>
                <span data-oid="4idvvuk">Version 1.0.0</span>
              </div>
            </div>

            {/* Age-Appropriate Badge */}
            <div className="flex items-center space-x-2" data-oid="luk4m0h">
              <div
                className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
                data-oid="6igd6rz"
              >
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20" data-oid="_gdxqaq">
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                    data-oid="m1sy7dw"
                  />
                </svg>
                <span data-oid="2vau.3p">Safe for Kids</span>
              </div>
              <div
                className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium"
                data-oid="p7r9y:g"
              >
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20" data-oid="yct6rza">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                    data-oid="4o8m2fy"
                  />
                </svg>
                <span data-oid=".3oc4do">COPPA Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
