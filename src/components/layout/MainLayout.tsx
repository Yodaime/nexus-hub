import { AppSidebar } from './AppSidebar';
import { MobileBottomNav } from './MobileBottomNav';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <main className="flex-1 min-h-screen overflow-auto pb-20 lg:pb-0">
        <div className="container mx-auto px-4 py-6 lg:px-8 lg:py-10">
          {children}
        </div>
      </main>
      <MobileBottomNav />
    </div>
  );
}
