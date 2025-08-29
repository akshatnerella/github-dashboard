import { BackgroundCanvas } from '@/components/background-canvas';
import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <div className="relative h-dvh overflow-hidden"> {/* lock to viewport, no scroll */}
      {/* Background Canvas */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <BackgroundCanvas />
      </div>

      {/* Single container with overlays */}
      <div className="relative h-full flex flex-col">
        {/* Header overlay */}
        <div className="absolute top-0 left-0 right-0 z-10">
          <Header />
        </div>

        {/* Main content centered */}
        <div className="flex-grow flex items-center justify-center">
          <Hero />
        </div>

        {/* Footer overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <Footer />
        </div>
      </div>
    </div>
  );
}
