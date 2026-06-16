const Footer = () => {
  return (
    <footer className="bg-teal-900 text-teal-50 border-t border-teal-800">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <div>
            <p>
              &copy; {new Date().getFullYear()} <strong className="text-teal-100">Sciencelet</strong>. All rights reserved.
            </p>
          </div>
          <div className="text-center sm:text-right text-teal-200">
            <p>
              Licensed under{' '}
              <a 
                href="http://creativecommons.org/licenses/by-nc/4.0/" 
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-teal-100 hover:text-white underline decoration-teal-500 hover:decoration-teal-300 transition-colors"
              >
                CC BY-NC 4.0
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
