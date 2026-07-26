import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineViewGrid,
  HiOutlineSearch,
  HiOutlineDocumentReport,
  HiOutlineClock,
  HiOutlineBookmark,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineCheckCircle,
  HiOutlineAcademicCap,
  HiOutlineShieldCheck,
  HiOutlineBriefcase,
  HiOutlineChatAlt2,
  HiOutlineDocumentText,
  HiOutlineServer
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { APP_NAME } from '../../constants';

const iconMap = {
  HiOutlineViewGrid,
  HiOutlineSearch,
  HiOutlineDocumentReport,
  HiOutlineClock,
  HiOutlineBookmark,
  HiOutlineCog,
  HiOutlineCheckCircle,
  HiOutlineAcademicCap,
  HiOutlineShieldCheck,
  HiOutlineBriefcase,
  HiOutlineChatAlt2,
  HiOutlineDocumentText,
  HiOutlineServer
};

const sidebarLinks = [
  { name: 'Dashboard', path: '/dashboard', icon: 'HiOutlineViewGrid' },
  { name: 'Workspace', path: '/dashboard/workspace', icon: 'HiOutlineBriefcase' },
  { name: 'Research', path: '/dashboard/research', icon: 'HiOutlineSearch' },
  { name: 'Verification', path: '/dashboard/verification', icon: 'HiOutlineCheckCircle' },
  { name: 'Citations', path: '/dashboard/citations', icon: 'HiOutlineAcademicCap' },
  { name: 'Reliability', path: '/dashboard/reliability', icon: 'HiOutlineShieldCheck' },
  { name: 'Report Intelligence', path: '/dashboard/reports', icon: 'HiOutlineDocumentReport' },
  { name: 'Document Intelligence', path: '/dashboard/documents', icon: 'HiOutlineDocumentText' },
  { name: 'AI Assistant', path: '/dashboard/assistant', icon: 'HiOutlineChatAlt2' },
  { name: 'History', path: '/dashboard/history', icon: 'HiOutlineClock' },
  { name: 'Bookmarks', path: '/dashboard/bookmarks', icon: 'HiOutlineBookmark' },
  { name: 'Settings', path: '/dashboard/settings', icon: 'HiOutlineCog' },
];

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-16 lg:h-20 border-b border-slate-200 dark:border-slate-700/50 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-lg">C</span>
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg font-bold text-slate-900 dark:text-white whitespace-nowrap"
          >
            {APP_NAME}
          </motion.span>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {sidebarLinks.map((link) => {
          const Icon = iconMap[link.icon];
          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/dashboard'}
              onClick={() => setMobileOpen?.(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${
                  isActive
                    ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                }
                ${collapsed ? 'justify-center' : ''}`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{link.name}</span>}
            </NavLink>
          );
        })}
        {user?.role === 'admin' && (
          <NavLink
            to="/dashboard/admin"
            onClick={() => setMobileOpen?.(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
              ${
                isActive
                  ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
              }
              ${collapsed ? 'justify-center' : ''}`
            }
          >
            <HiOutlineServer className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Admin Dashboard</span>}
          </NavLink>
        )}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-700/50 shrink-0">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full
            text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all cursor-pointer
            ${collapsed ? 'justify-center' : ''}`}
        >
          <HiOutlineLogout className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle (desktop only) */}
      <div className="hidden lg:block p-3 border-t border-slate-200 dark:border-slate-700/50 shrink-0">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
        >
          {collapsed ? (
            <HiOutlineChevronRight className="w-5 h-5" />
          ) : (
            <HiOutlineChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.2 }}
        className="hidden lg:flex flex-col h-screen sticky top-0 bg-white dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-700/50 shrink-0"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] z-50 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700/50 lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
