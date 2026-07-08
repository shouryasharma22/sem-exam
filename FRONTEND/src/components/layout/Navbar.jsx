import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="sticky top-0 w-full border-b border-[#434655] bg-[#0c1324]/80 backdrop-blur-md z-50">
      <div className="flex justify-between items-center px-6 py-6 max-w-7xl mx-auto">
        
        {/* Left Side Branding */}
        <Link to="/" className="flex items-center text-2xl tracking-tight cursor-pointer select-none">
          <span className="font-bold text-[#b4c5ff]">Sem</span>
          <span className="font-light text-[#dce1fb]">Exam</span>
        </Link>
        
        {/* Right Side Passive Content Routers */}
        <nav className="flex items-center gap-12">
          <Link to="/" className="text-base text-[#c3c6d7] hover:text-[#b4c5ff] transition-colors font-medium">
            PYQS
          </Link>
          <a href="#notes" className="text-base text-[#c3c6d7] hover:text-[#b4c5ff] transition-colors font-medium">
            Notes
          </a>
        </nav>

      </div>
    </header>
  );
}