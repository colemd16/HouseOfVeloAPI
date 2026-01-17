// Short taglines for service cards
export const serviceTaglines: Record<string, string> = {
  'MV Hitting Evolution Program':
    'Our Patented Off-Season Training Program guaranteed to get the results you need!',
  'MV Pitching Evolution Program':
    'Our Patented Off-Season Training Program guaranteed to get the results you need!',
  'MV Strength Session':
    'The Perfect Pairing to our MV Evolution program. Get STRONGER so your new found skills can stick!',
  'College Break Group': 'Home for break is no time to take a break on development!',
  '30 min Hitting Lesson': 'Fast. Focused. Effective. Sharpen your swing in 30 minutes!',
  '1 Hour Hitting Lesson':
    'One hour to elevate your swing - Build consistency, power, and confidence',
  '30 min Pitching Lesson':
    '30 Minutes to Sharpen Your Edge – Tune Up, Dial In, and Throw with Purpose!',
  '1 Hour Pitching Lesson':
    'Train Like a Pro – Precision, Power, and Arm Care Built for Longevity!',
  '1 Hour Skills Lesson':
    'Work on any combination of skills – hitting, fielding, pitching, or catching!',
  '90 min Combo Lesson (2 skills)': 'Work on Two Skills (pitching/hitting/catching/fielding)',
};

// Get tagline with fallback
export function getServiceTagline(name: string, fallback?: string): string {
  return serviceTaglines[name] || fallback || '';
}

// 518 Velocity benefits
export interface Benefit {
  title: string;
  description: string;
  icon?: string;
}

export const velocity518Benefits: Benefit[] = [
  {
    title: 'Elite Coaching Staff',
    description:
      'Our coaches bring professional and collegiate experience, providing players with high-level instruction and mentorship that prepares them for the next level.',
  },
  {
    title: 'Competitive Play',
    description:
      'We compete in premier tournaments throughout the Northeast, giving our players exposure to college scouts and high-level competition.',
  },
  {
    title: 'Player Development',
    description:
      "Access to House of Velo's state-of-the-art training facility and technology, including HitTrax, Rapsodo, and professional coaching year-round.",
  },
  {
    title: 'Character Building',
    description:
      'We emphasize sportsmanship, leadership, and personal growth, developing well-rounded young men who excel in all aspects of life.',
  },
  {
    title: 'College Recruiting Support',
    description:
      'Guidance through the recruiting process, helping players connect with college programs and showcase their talents to scouts.',
  },
  {
    title: 'Proven Track Record',
    description:
      'Multiple tournament championships, showcase appearances, and successful college placements demonstrate our commitment to excellence.',
  },
];

// Age groups for 518 Velocity
export const ageGroups = ['13U', '14U', '15U', '16U', '17U', '18U'];
