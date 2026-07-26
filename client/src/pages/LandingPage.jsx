import Navbar from '../components/layout/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import TechStack from '../components/landing/TechStack';
import WhyClaurusIQ from '../components/landing/WhyClaurusIQ';
import Footer from '../components/layout/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <TechStack />
      <WhyClaurusIQ />
      <Footer />
    </div>
  );
};

export default LandingPage;
