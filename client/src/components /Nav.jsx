import { useState } from 'react';
import DarkLogo from '../assets/dark-logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';

const Nav = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 p-3">
      <div className="flex justify-between items-center">
        {/* Logo et liens desktop */}
        <div className="flex items-center">
          <img src={DarkLogo} alt="Logo" width="120" />
          <div className="ml-4 hidden md:flex space-x-4">
            <Link to="/dashboard" className="text-gray-800 hover:text-blue-500">
              Accueil
            </Link>
            <Link to="/contact" className="text-gray-800 hover:text-blue-500">
              Contact
            </Link>
          </div>
        </div>

        {/* Bouton Logout desktop */}
        <div className="hidden md:block">
          <button
            onClick={handleLogout}
            className="border border-blue-500 text-blue-500 rounded-md px-4 py-2 hover:bg-blue-50"
          >
            Logout
          </button>
        </div>

        {/* Bouton menu mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setOpen(!open)}
            className="p-2 focus:outline-none"
          >
            {open ? <HiX className="size-6" /> : <HiMenu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {open && (
        <div className="mt-4 flex flex-col space-y-2 md:hidden">
          <Link to="/dashboard" className="text-gray-800 hover:text-blue-500">
            Accueil
          </Link>
          <Link to="/contact" className="text-gray-800 hover:text-blue-500">
            Contact
          </Link>
          <button
            onClick={handleLogout}
            className="border border-blue-500 text-blue-500 rounded-md px-4 py-2 w-full hover:bg-blue-50"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Nav;
