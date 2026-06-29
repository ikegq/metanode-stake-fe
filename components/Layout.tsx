import { FiGithub, FiTwitter } from 'react-icons/fi';
import Header from './Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative flex flex-col grow">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
          <div className="absolute inset-0 tech-grid" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-500/10 via-transparent to-transparent" />
        </div>

        <div className="relative flex flex-col flex-grow">
          {/* Content */}
          <Header />

          <main className="flex-grow max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">{children}</main>

          {/* Footer */}
          <footer className="relative bg-gray-900/50 backdrop-blur-xl border-t border-gray-800 mt-auto">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-3 sm:space-y-4 md:space-y-0">
                <div className="text-gray-400 text-xs sm:text-sm md:text-base">© {new Date().getFullYear()} MetaNode Stake. All rights reserved.</div>
                <div className="flex items-center space-x-4 sm:space-x-6">
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-primary-400 transition-colors duration-200">
                    <FiTwitter className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-primary-400 transition-colors duration-200">
                    <FiGithub className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
