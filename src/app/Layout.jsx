import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/features/hero/Navbar';
import { Footer } from '@/features/footer/Footer';
import { SkipLink } from '@/components/SkipLink';
import { BookingModal } from '@/features/booking/BookingModal';

export const BookingModalContext = React.createContext({
  openDemoModal: () => {},
});

export function Layout() {
  const [demoModalOpen, setDemoModalOpen] = React.useState(false);

  const openDemoModal = React.useCallback(() => {
    setDemoModalOpen(true);
  }, []);

  return (
    <BookingModalContext.Provider value={{ openDemoModal }}>
      <div className="flex min-h-screen flex-col bg-bg text-foreground transition-colors duration-200">
        <SkipLink />
        <Navbar onOpenDemoModal={openDemoModal} />
        <main id="main-content" className="flex-1">
          <Outlet />
        </main>
        <Footer />

        {/* Global Demo Booking Modal */}
        <BookingModal open={demoModalOpen} onOpenChange={setDemoModalOpen} initialType="demo" />
      </div>
    </BookingModalContext.Provider>
  );
}
