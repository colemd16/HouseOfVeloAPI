import { PublicLayout } from '../../components/public/PublicLayout';
import { HeroSection } from '../../components/public/sections/HeroSection';
import { StatsSection } from '../../components/public/sections/StatsSection';
import { OrganizationsSection } from '../../components/public/sections/OrganizationsSection';
import { ServicesPreview } from '../../components/public/sections/ServicesPreview';
import { TeamSection } from '../../components/public/sections/TeamSection';
import { TestimonialsSection } from '../../components/public/sections/TestimonialsSection';
import { CTASection } from '../../components/public/sections/CTASection';

export function Home() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <HeroSection
        title="ELEVATE YOUR GAME"
        subtitle="House of Velo"
        description="Elite baseball training and premier travel baseball in Saratoga County. Where champions are made."
        primaryCTA={{ text: 'Book a Session', href: '/services' }}
        secondaryCTA={{ text: 'Join 518 Velocity', href: '/518-velocity' }}
        backgroundImage="~/images/home_hero.mp4"
        showScrollIndicator={true}
        overlay="gradient"
        size="full"
      />

      {/* Stats Section */}
      <StatsSection
        subtitle="By the Numbers"
        title="Proven Results"
      />

      {/* Organizations Section */}
      <OrganizationsSection />

      {/* Services Preview Section */}
      <ServicesPreview
        subtitle="Train Like a Pro"
        title="Elite Training Programs"
        description="From personalized lessons to comprehensive development programs, we offer training solutions for athletes at every level."
      />

      {/* Team Preview Section */}
      <TeamSection
        subtitle="Expert Coaching Staff"
        title="Meet Our Team"
        description="Our coaches bring decades of combined experience in professional and collegiate baseball."
        variant="preview"
        maxMembers={3}
      />

      {/* Testimonials Section */}
      <TestimonialsSection
        subtitle="Success Stories"
        title="What Athletes Say"
      />

      {/* CTA Section */}
      <CTASection
        title="Ready to Dominate?"
        subtitle="Start Your Journey"
        description="Join the hundreds of athletes who've transformed their game at House of Velo. Your next level awaits."
        primaryCTA={{ text: 'Book a Session', href: '/services' }}
        secondaryCTA={{ text: 'Contact Us', href: '/contact' }}
      />
    </PublicLayout>
  );
}
