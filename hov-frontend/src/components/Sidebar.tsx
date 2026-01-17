import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types/enums';

interface NavItem {
  label: string;
  path: string;
  roles?: Role[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Players', path: '/players', roles: [Role.PARENT, Role.ADMIN] },
  { label: 'Bookings', path: '/bookings' },
  { label: 'Payments', path: '/payments' },
  { label: 'My Schedule', path: '/schedule', roles: [Role.TRAINER] },
  { label: 'Availability', path: '/availability', roles: [Role.TRAINER] },
  { label: 'Session Types', path: '/admin/session-types', roles: [Role.ADMIN] },
  { label: 'All Bookings', path: '/admin/bookings', roles: [Role.ADMIN] },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, hasRole, logout } = useAuth();

  const filteredItems = navItems.filter(
    (item) => !item.roles || hasRole(item.roles)
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-velo-black transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <NavLink to="/dashboard" onClick={onClose}>
            <img
              src="/images/houseofvelo.png"
              alt="House of Velo"
              className="h-16 w-auto mx-auto"
            />
          </NavLink>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-gray-800">
          <p className="text-gold font-semibold truncate">{user?.name}</p>
          <p className="text-gray-400 text-sm capitalize">
            {user?.role.toLowerCase()}
          </p>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {filteredItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-gold text-velo-black font-semibold'
                        : 'text-white hover:bg-gold/10 hover:text-gold'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="w-full px-4 py-3 text-left text-white hover:bg-velo-red/20 hover:text-velo-red rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
