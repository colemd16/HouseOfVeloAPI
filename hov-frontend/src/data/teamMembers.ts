export interface TeamMember {
  id: string;
  name: string;
  title: string;
  shortTitle: string;
  image: string;
  bio: string[];
  highlights?: { title: string; text: string }[];
  closingBio?: string;
  education: string;
  certifications: string[];
}

export const teamMembers: TeamMember[] = [
  {
    id: 'joey-moore',
    name: 'Joey Moore',
    title: 'Owner and Founder of Moore Velocity & 518 Velocity Baseball Club',
    shortTitle: 'Owner & Head Trainer',
    image: '/images/joeymoore.avif',
    bio: [
      "Currently the owner/head trainer of Moore Velocity Player Development, specializing in 1:1 and group training for any and all skills related to baseball and strength and conditioning.",
      "He's also the General Manager and owner of 518 Velocity Baseball Club in Saratoga Springs. Prior to starting Moore Velocity, he was Playing/Coaching professionally in Western Australia.",
      "Joey graduated from Saratoga Springs where he was a three sport letter winner and Captain in basketball, baseball and football for the Blue Streaks. After SSHS he accepted a scholarship to join the Division 1 baseball program as a Right handed pitcher at UAlbany under head coach Jon Mueller.",
    ],
    education: 'BS in Sociology & Communications at SUNY Albany',
    certifications: [
      'Rapsodo Baseball Certified',
      'NYPHS Coaching Certification',
      'Driveline Hitting & Pitching Certified',
      'NASM Strength & Nutrition Certified',
      'Trained at Cressey Sports Performance',
    ],
  },
  {
    id: 'nolan-gaige',
    name: 'Nolan Gaige',
    title: 'Hitting Instructor – Moore Velocity Sports Performance | Head Coach for 518 Velocity 14U',
    shortTitle: 'Hitting Instructor',
    image: '/images/nolangaige.jpeg',
    bio: [
      'Nolan brings a wealth of knowledge and experience as a standout player at the high school, collegiate, and elite summer league levels.',
    ],
    highlights: [
      {
        title: 'Columbia High School (2009)',
        text: 'Set single-season records in batting average (.548), OBP (.633), home runs (11), RBIs (50), and hits (48). Named Times Union Player of the Year, Pitcher of the Year, and Hitter of the Year for Class AA. Selected as a First-Team All-State player and Northeast All-American.',
      },
      {
        title: 'UAlbany (2009–2013)',
        text: 'All-time program leader in hits, career triples, and triples in a season (9). Earned All-Rookie honors as a freshman and All-Conference recognition for three consecutive years.',
      },
      {
        title: 'Elite Summer League Experience',
        text: 'Named Southern Collegiate League Player of the Year in 2011 after hitting .458. Played in the Cape Cod Baseball League in 2012 with future MLB stars Aaron Judge and Jeff McNeil.',
      },
    ],
    closingBio:
      'With his record-breaking hitting background and elite-level experience, Nolan is passionate about helping young players unlock their potential and succeed on and off the field.',
    education: 'Bachelor\'s in Communications at SUNY Albany',
    certifications: ['Rapsodo Baseball Certified', 'Driveline Hitting Certified'],
  },
  {
    id: 'christian-garcia',
    name: 'Christian Garcia',
    title: 'Trainer/Coach/Facility Manager',
    shortTitle: 'Pitching Specialist',
    image: '/images/christiangarcia.jpg',
    bio: [
      'Born and raised in Saratoga Springs, NY, a graduate of Spa Catholic in Saratoga. Christian was the Ace Pitcher of the 2009 Spa Catholic team that won their Section 2 title and made it to the State Championship game. He went on to pitch 1 season at UAlbany before transferring to Florence-Darlington Tech where he was drafted in the 29th round of the 2012 MLB Draft by the Houston Astros.',
      'Christian specializes in Pitching, but is also very knowledgeable in anything you need to excel at baseball!',
    ],
    education: 'BS in Sport Management at Florence Darlington Tech',
    certifications: ['Rapsodo Baseball Certified', 'Driveline Certified'],
  },
];

export function getTeamMember(id: string): TeamMember | undefined {
  return teamMembers.find((m) => m.id === id);
}
