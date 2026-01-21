const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-50 to-blue-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-600">
          <div>
            <p>
              &copy; {new Date().getFullYear()} <strong className="text-slate-900">Tanbin Jahan Ferdousy</strong> <i>et al.</i>
            </p>
          </div>
          <div className="text-center sm:text-right">
            <p>
              Licensed under{' '}
              <a 
                href="http://creativecommons.org/licenses/by-nc/4.0/" 
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-blue-600 hover:text-blue-700 underline decoration-blue-200 hover:decoration-blue-400 transition-colors"
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
