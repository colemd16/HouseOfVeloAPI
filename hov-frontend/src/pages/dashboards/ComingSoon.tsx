import { useAuth } from '../../contexts/AuthContext';

interface ComingSoonProps {
  feature: string;
}

export function ComingSoon({ feature }: ComingSoonProps) {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center mb-6">
        <svg
          className="w-12 h-12 text-gold"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-velo-black mb-2">Coming Soon</h1>
      <p className="text-gray-500 mb-4 max-w-md">
        Hey {user?.name?.split(' ')[0]}, the <span className="text-gold font-semibold">{feature}</span> is currently under development. Check back soon!
      </p>
      <p className="text-sm text-gray-400">
        We're working hard to bring you this feature.
      </p>
    </div>
  );
}
