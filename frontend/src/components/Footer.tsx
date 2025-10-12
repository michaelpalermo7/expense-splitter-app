const Footer = () => {
  return (
    <footer className="w-full bg-black text-white py-4 flex flex-col items-center justify-center text-sm">
      <p className="text-center">
        Created by{" "}
        <a
          href="https://www.linkedin.com/in/michael-palermo-qc"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium underline hover:text-blue-500 transition-colors"
        >
          Michael Palermo
        </a>{" "}
        using Spring Boot, PostgreSQL, React.js & TailwindCSS .
      </p>
    </footer>
  );
};

export default Footer;
