const Footer = () => {
  return (
    <footer className="bg-green-100 mx-auto border-t border-green-200 text-black">
      <div className="text-center max-w-7xl mx-auto py-8 px-3 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        <div className="">
          <p>&copy; {new Date().getFullYear()} <strong>Tanbin Jahan Ferdousy</strong> <i>et al.</i></p>
        </div>
        <div className="text-center sm:text-right">
          <p>
            This work is licensed under <strong><a href="http://creativecommons.org/licenses/by-nc/4.0/" className="text-green-600">CC BY-NC 4.0</a></strong>.
            {/* <Link href="/privacy-policy" className="text-gray-600 hover:text-gray-800">Privacy Policy</Link> |{' '}
            <Link href="/terms" className="text-gray-600 hover:text-gray-800">Terms of Use</Link> */}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
