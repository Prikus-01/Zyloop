import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          <Sidebar />
          <main className="flex-1 min-w-0 animate-fade-in">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
