import { Mail, ArrowUpRight } from 'lucide-react';

const GithubIcon = ({ size = 14, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);


  return (
    <footer className="w-full bg-black text-white border-t border-neutral-800 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand & Purpose (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <h2 className="text-xl font-bold font-serif tracking-tight text-white">
              Sem<span className="text-[#ff571a]">Exam</span>
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              An academic resource archive providing past examination papers, textbooks, and verified lecture notes for students.
            </p>
          </div>

          {/* Resources Navigation (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider font-mono text-neutral-400">
              Resources
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/pyqs"
                  className="text-neutral-300 hover:text-[#ff571a] transition-colors cursor-pointer text-left"
                >
                  Past Year Papers
                </a>
              </li>
              <li>
                <a
                  href="/books"
                  className="text-neutral-300 hover:text-[#ff571a] transition-colors cursor-pointer text-left"
                >
                  Textbooks
                </a>
              </li>
              <li>
                <a
                  href="/notes"
                  className="text-neutral-300 hover:text-[#ff571a] transition-colors cursor-pointer text-left"
                >
                  Class Notes
                </a>
              </li>
            </ul>
          </div>

          {/* Essential Contact & Links (4 cols) */}
          {/*<div className="md:col-span-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider font-mono text-neutral-400">
              Contact & Support
            </h3>
            <div className="space-y-2.5 text-xs">
              <a
                href="mailto:contact@semexam.com"
                className="inline-flex items-center gap-2 text-neutral-300 hover:text-[#ff571a] transition-colors"
              >
                <Mail size={14} className="text-neutral-400" />
                <span>shouryasharmaaaaaa@gmail.com</span>
              </a>

              <div className="pt-1">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors font-mono"
                >
                   🟩 FIXED: Changed <Github /> to <GithubIcon /> 
                  <GithubIcon size={14} />
                  <span>GitHub Repository</span>
                  <ArrowUpRight size={12} className="text-neutral-500" />
                </a>
              </div>
            </div>
          </div> */}

        </div>

        {/* Bottom Minimal Copyright Bar */}
        <div className="mt-12 pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-neutral-500">
          <p>© {new Date().getFullYear()} SemExam. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="/admin" className="hover:text-neutral-300 transition-colors">
              Admin Portal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}