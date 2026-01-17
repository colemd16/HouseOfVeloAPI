export interface Testimonial {
  id: string;
  text: string;
  author: string;
  role: string;
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    text: "The Evolution Program transformed my son's approach at the plate. The data-driven coaching and small group setting made all the difference. He's never been more confident!",
    author: 'Sarah M.',
    role: 'Parent',
  },
  {
    id: '2',
    text: "Working with the coaching staff here has taken my pitching to the next level. The combination of mechanics work and arm care has added velocity while keeping me healthy.",
    author: 'Jake T.',
    role: 'High School Pitcher',
  },
  {
    id: '3',
    text: "House of Velo isn't just about baseball skills—they truly care about developing the whole athlete. The culture and coaching are second to none in the area.",
    author: 'Mike D.',
    role: 'Travel Ball Parent',
  },
  {
    id: '4',
    text: "The 518 Velocity program has been incredible for my development. Great coaching, competitive games, and a team that feels like family. Best decision I ever made.",
    author: 'Alex R.',
    role: '16U Player',
  },
  {
    id: '5',
    text: "Professional facility, elite coaching staff, and a commitment to excellence. Our entire team has improved dramatically since training at House of Velo.",
    author: 'Coach Williams',
    role: 'Youth Baseball',
  },
];
