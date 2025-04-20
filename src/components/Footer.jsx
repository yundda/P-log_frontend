import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-plog-main2/20 py-6 mt-12 text-center">
      <div className="max-w-screen-xl mx-auto px-4">
        <p className="text-sm text-gray-600">
          © 2025 P-log. All rights reserved. |
          <a
            href="https://github.com/yundda/P-log_frontend.git"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-plog-main5 hover:underline"
          >
            About Us
          </a>
        </p>
      </div>
    </footer>
  );
}
