const Footer = () => {
  return (
    <footer className="w-full bg-[#000000] text-white pt-8 pb-6 text-xs">
      <div className="max-w-[480px] mx-auto grid grid-cols-2 gap-y-2 px-6">
        <a href="#" className="text-xs tracking-wide opacity-90 font-normal">
          FAQ
        </a>
        <a href="#" className="text-xs tracking-wide opacity-90 font-normal">
          Privacy Policy
        </a>
        <a href="#" className="text-xs tracking-wide opacity-90 font-normal">
          Contact
        </a>
        <a href="#" className="text-xs tracking-wide opacity-90 font-normal">
          Terms of Service
        </a>
      </div>

      <div className="mt-10 text-left text-gray-300 opacity-80 text-xs leading-relaxed px-6">
        © Created by{" "}
        <a
          href="https://www.linkedin.com/in/michael-palermo-qc"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-blue-400"
        >
          Michael Palermo
        </a>{" "}
        using Spring Boot, React & PostgreSQL.
      </div>
    </footer>
  );
};

export default Footer;
