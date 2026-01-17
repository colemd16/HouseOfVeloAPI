import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const announcements = [
  {
    text: "We Moved!! The HOV is now in the GBAC (Gary Bynon Athletic Center)",
    link: null,
  },
  {
    text: "OFF SEASON EVOLUTION schedule is now LIVE",
    link: null,
  },
  {
    text: "Can't find what you are looking for?",
    link: { text: "Email us", href: "mailto:info@houseofvelo.com", external: true },
  },
  {
    text: "Looking for a travel club? (13u-18u)",
    link: { text: "Tryout with 518", href: "/518-velocity", external: false },
  },
  {
    text: "Want to improve your game?",
    link: { text: "View Services", href: "/services", external: false },
  },
];

export function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % announcements.length);
        setIsVisible(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const current = announcements[currentIndex];

  return (
    <div className="bg-transparent py-3 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-velo-black border border-gray-800 rounded-full px-6 py-3 shadow-lg">
          <div
            className={`flex items-center justify-center gap-2 text-white font-semibold text-sm md:text-base transition-opacity duration-500 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span>{current.text}</span>
            {current.link && (
              current.link.external ? (
                <a
                  href={current.link.href}
                  className="bg-gold text-black px-3 py-1 rounded-full text-sm font-bold hover:bg-gold-hover transition-colors"
                >
                  {current.link.text}
                </a>
              ) : (
                <Link
                  to={current.link.href}
                  className="bg-gold text-black px-3 py-1 rounded-full text-sm font-bold hover:bg-gold-hover transition-colors"
                >
                  {current.link.text}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
