import { BackgroundCanvas } from '@/components/background-canvas';
import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import { AnimatedTilesPeek } from '@/components/animated-tiles-peek';
import { Integrations } from '@/components/integrations';
import { Benefits } from '@/components/benefits';
import { HowItWorks } from '@/components/how-it-works';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <BackgroundCanvas />
      
      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          <AnimatedTilesPeek />
          <Integrations />
          <Benefits />
          <HowItWorks />
        </main>
        <Footer />
      </div>
    </div>
  );
}