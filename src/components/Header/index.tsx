import { Link, NavLink } from 'react-router-dom';
import useSiteMetadata from '@/hooks/useSiteMetadata';

const Header = () => {
  const { navLinks } = useSiteMetadata();

  return (
    <header className="border-white/6 bg-black/88 fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-[1680px] items-center justify-between px-6 lg:px-10">
        <div className="flex items-center">
          <Link
            to="/"
            className="text-[2rem] font-black uppercase tracking-[-0.06em] text-white transition-opacity hover:opacity-90 lg:text-[2.45rem]"
          >
            RUN
            <span className="text-red-600">.LOG</span>
          </Link>
        </div>

        <nav className="flex items-center justify-end gap-4 text-sm font-medium text-zinc-300 lg:gap-7 lg:text-base">
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
