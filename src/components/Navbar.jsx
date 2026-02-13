import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store/store';

export default function Navbar() {
  const location = useLocation();
  const { state } = useStore();
  const currentFriend = state.friends.find((f) => f.id === state.currentUser);

  const links = [
    { to: '/', label: 'Markets', icon: '📊' },
    { to: '/create', label: 'Create', icon: '✨' },
    { to: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
    { to: '/portfolio', label: 'My Bets', icon: '💰' },
  ];

  return (
    <nav className="bg-surface border-b border-border sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <span className="text-2xl">🎲</span>
            <span className="text-text-bright font-extrabold text-xl tracking-tight">
              FriendCast
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium no-underline transition-colors ${
                  location.pathname === link.to
                    ? 'bg-primary/20 text-primary'
                    : 'text-text-dim hover:text-text hover:bg-surface-light'
                }`}
              >
                <span className="mr-1">{link.icon}</span>
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-surface-light rounded-full px-3 py-1.5">
            <span>{currentFriend?.emoji}</span>
            <span className="text-accent font-bold text-sm">
              ${currentFriend?.balance.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
