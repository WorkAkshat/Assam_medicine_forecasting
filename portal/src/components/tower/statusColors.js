// Shared between the 3D scene and the HTML panels (kept separate so pages don't pull in three.js).
export const STATUS_COLORS = { critical: '#ef6a53', watch: '#e0aa3e', healthy: '#4fd1c1', excess: '#8fa6ff' };

export function locStatus(l) {
  if (l.health < 60 || l.critical >= 6) return 'critical';
  if (l.health < 78) return 'watch';
  if (l.excess >= 3) return 'excess';
  return 'healthy';
}
