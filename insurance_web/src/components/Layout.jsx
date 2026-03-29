import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

export default function Layout({ sidebar: Sidebar }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <Outlet />
        </div>
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { borderRadius: '8px', background: '#333', color: '#fff' },
        }}
      />
    </div>
  );
}
