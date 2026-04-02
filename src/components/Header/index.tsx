import { Link, NavLink } from 'react-router-dom';
import useSiteMetadata from '@/hooks/useSiteMetadata';

const Header = () => {
  const { navLinks } = useSiteMetadata();

  return (
    <header className="border-white/8 bg-black/88 fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        <div className="flex items-center">
          <Link
            to="/"
            className="font-black uppercase leading-none text-white transition-opacity hover:opacity-90"
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '3.3rem',
              letterSpacing: '-0.12em',
            }}
          >
            RUN
            <span className="text-red-600">.LOG</span>
          </Link>
        </div>

        <nav className="flex items-center justify-end gap-4 text-sm font-medium text-zinc-300 lg:gap-7">
          {navLinks.map((link) => (
            <NavLink
              key={link.url}
              to={link.url}
              className={({ isActive }) =>
                `transition-colors hover:text-white ${
                  isActive ? 'text-white' : 'text-zinc-400'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
