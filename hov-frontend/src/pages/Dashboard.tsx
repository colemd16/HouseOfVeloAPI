import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types/enums';
import { ParentDashboard } from './dashboards/ParentDashboard';
import { PlayerDashboard } from './dashboards/PlayerDashboard';
import { TrainerDashboard } from './dashboards/TrainerDashboard';
import { AdminDashboard } from './dashboards/AdminDashboard';
import { ComingSoon } from './dashboards/ComingSoon';

export function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case Role.PARENT:
      return <ParentDashboard />;
    case Role.PLAYER:
      return <PlayerDashboard />;
    case Role.TRAINER:
      return <TrainerDashboard />;
    case Role.ADMIN:
      return <AdminDashboard />;
    case Role.SCOUT:
      return <ComingSoon feature="Scout Dashboard" />;
    default:
      return <ParentDashboard />;
  }
}
