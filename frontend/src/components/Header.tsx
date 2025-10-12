import { Link } from "react-router-dom";
import OwelyLogoWhite from "../assets/OwelyLogoWhite.png";

const Header = () => {
  return (
    <header className="w-full bg-black shadow-sm flex justify-center items-center h-16 md:h-20">
      <Link
        to="/"
        aria-label="Go to home"
        className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded"
      >
        <img
          src={OwelyLogoWhite}
          alt="Owely.io Logo"
          className="h-10 md:h-12 object-contain cursor-pointer"
        />
      </Link>
    </header>
  );
};

export default Header;
