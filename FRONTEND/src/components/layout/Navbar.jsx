import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="sticky top-0 w-full bg-black z-50">
      <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center text-2xl tracking-tight cursor-pointer select-none">
          <span className="font-bold text-[#ff571a]">Sem</span>
          <span className="font-light text-white">Exam</span>
        </Link>

        <nav className="flex items-center gap-8 sm:gap-12">
          <NavLink
            to="/pyqs"
            className={({ isActive }) =>
              `text-base font-medium transition-colors ${
                isActive ? 'text-[#ff571a]' : 'text-white hover:text-[#ff571a]'
              }`
            }
          >
            PYQS
          </NavLink>
          <NavLink
            to="/notes"
            className={({ isActive }) =>
              `text-base font-medium transition-colors ${
                isActive ? 'text-[#ff571a]' : 'text-white hover:text-[#ff571a]'
              }`
            }
          >
            Notes
          </NavLink>
          <NavLink
            to="/books"
            className={({ isActive }) =>
              `text-base font-medium transition-colors ${
                isActive ? 'text-[#ff571a]' : 'text-white hover:text-[#ff571a]'
              }`
            }
          >
            Books
          </NavLink>
        </nav>
      </div>
    </header>
  );
}