export interface Stat {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
}

export const homeStats: Stat[] = [
  { value: 5, suffix: '+', label: 'Years Experience' },
  { value: 500, suffix: '+', label: 'Athletes Trained' },
  { value: 3, label: 'Expert Coaches' },
  { value: 10, suffix: '+', label: 'Training Programs' },
];

export const velocity518Stats: Stat[] = [
  { value: 6, label: 'Age Divisions' },
  { value: 4, suffix: '+', label: 'Championships' },
  { value: 50, suffix: '+', label: 'College Placements' },
  { value: 100, suffix: '%', label: 'Commitment' },
];
