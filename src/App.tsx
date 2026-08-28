import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { QRResultModal } from './components/QRResultModal';
import { PrintLabelModal } from './components/PrintLabelModal';
import { HomePage } from './pages/HomePage';
import { CreateProducePage } from './pages/CreateProducePage';
import { ScanPage } from './pages/ScanPage';
import { PublicProducePage } from './pages/PublicProducePage';
import { DashboardPage } from './pages/DashboardPage';
import { ProduceRecordsPage } from './pages/ProduceRecordsPage';
import { QRManagementPage } from './pages/QRManagementPage';
import { FarmsPage } from './pages/FarmsPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AboutPage } from './pages/AboutPage';
import { FutureUpdatesPage } from './pages/FutureUpdatesPage';
import { LoginPage } from './pages/LoginPage';
import { ContactPage } from './pages/ContactPage';
import { ProduceRecord, UserSession } from './types';
import { ProduceStorageService } from './services/produceStorage';

// Helper function to resolve the target route from window location (pathname, search query, hash)
function getInitialRoute(): string {
  if (typeof window === 'undefined') return '/';

  // 1. Check URL query parameters (e.g. ?p=AUR-2026-TOM-8F42K or ?produceId=...)
  try {
    const search = window.location.search;
    if (search) {
      const urlParams = new URLSearchParams(search);
      const queryId = urlParams.get('p') || urlParams.get('produceId') || urlParams.get('id') || urlParams.get('batch') || urlParams.get('scan');
      if (queryId) {
        const clean = ProduceStorageService.normalizeId(queryId);
        if (clean) {
          return `/p/${clean}`;
        }
      }
    }
  } catch {
    // ignore search params parsing error
  }

  // 2. Check hash route (e.g. #/p/AUR-2026-TOM-8F42K or #p/AUR-... or #AUR-2026-...)
  try {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (hash) {
      if (hash.startsWith('p/')) {
        const id = hash.replace('p/', '').split('?')[0];
        return `/p/${ProduceStorageService.normalizeId(id)}`;
      }
      const idMatch = hash.match(/(?:AUR-\d{4}-[A-Z0-9]+-[A-Z0-9]+|[A-Z]{3,4}-\d{8}-\d{4}(?:-\d+)?)/i);
      if (idMatch) {
        return `/p/${idMatch[0].toUpperCase()}`;
      }
      if (hash.startsWith('/')) {
        return hash;
      }
      return `/${hash}`;
    }
  } catch {
    // ignore
  }

  // 3. Check pathname (e.g. /p/TOM-20260829-1223 or /p/AUR-...)
  const path = window.location.pathname;
  if (path && path !== '/') {
    const pMatch = path.match(/\/p\/([^\/\?\#]+)/i) || path.match(/\/produce\/([^\/\?\#]+)/i);
    if (pMatch && pMatch[1]) {
      return `/p/${ProduceStorageService.normalizeId(pMatch[1])}`;
    }
    const idMatch = path.match(/(?:AUR-\d{4}-[A-Z0-9]+-[A-Z0-9]+|[A-Z]{3,4}-\d{8}-\d{4}(?:-\d+)?)/i);
    if (idMatch) {
      return `/p/${idMatch[0].toUpperCase()}`;
    }
    return path;
  }

  return '/';
}

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => getInitialRoute());

  const [activeUser, setActiveUser] = useState<UserSession | null>(() => {
    return ProduceStorageService.getActiveUser();
  });

  // Modal States
  const [qrModalProduce, setQrModalProduce] = useState<ProduceRecord | null>(null);
  const [printModalProduce, setPrintModalProduce] = useState<ProduceRecord | null>(null);

  // Sync route with browser history & trigger server sync
  useEffect(() => {
    // Initial sync
    ProduceStorageService.syncWithServer().catch(() => {});

    const handleLocationChange = () => {
      setCurrentPath(getInitialRoute());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigate = (route: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      window.history.pushState({}, '', route);
    } catch (e) {
      // In strict iframe sandbox, fallback to hash
      window.location.hash = route;
    }
    setCurrentPath(route);
  };

  const handleLogout = () => {
    ProduceStorageService.setActiveUser(null);
    setActiveUser(null);
    navigate('/');
  };

  const handleLoginSuccess = (user: UserSession) => {
    setActiveUser(user);
    navigate('/dashboard');
  };

  // Route matching logic
  const renderCurrentPage = () => {
    // 1. Match public product page: /p/[produceId]
    const pMatch = currentPath.match(/\/p\/([^\/\?\#]+)/i);
    if (pMatch || currentPath.startsWith('/p/') || currentPath.startsWith('p/')) {
      const rawId = pMatch ? pMatch[1] : currentPath.replace(/^\/?p\//, '').split('?')[0].split('#')[0].replace(/\/+$/, '');
      const produceId = ProduceStorageService.normalizeId(rawId);
      return (
        <PublicProducePage
          produceId={produceId}
          navigate={navigate}
          onPrint={(p) => setPrintModalProduce(p)}
        />
      );
    }

    switch (currentPath) {
      case '/create':
        return (
          <CreateProducePage
            navigate={navigate}
            onSuccess={(newRecord) => {
              setQrModalProduce(newRecord);
            }}
          />
        );

      case '/scan':
        return <ScanPage navigate={navigate} />;

      case '/dashboard':
        return (
          <DashboardPage
            activeUser={activeUser}
            navigate={navigate}
            onOpenQR={(p) => setQrModalProduce(p)}
            onPrint={(p) => setPrintModalProduce(p)}
          />
        );

      case '/records':
        return (
          <ProduceRecordsPage
            navigate={navigate}
            onOpenQR={(p) => setQrModalProduce(p)}
            onPrint={(p) => setPrintModalProduce(p)}
          />
        );

      case '/qr-management':
        return (
          <QRManagementPage
            navigate={navigate}
            onPrint={(p) => setPrintModalProduce(p)}
            onOpenQR={(p) => setQrModalProduce(p)}
          />
        );

      case '/farms':
        return <FarmsPage navigate={navigate} />;

      case '/how-it-works':
        return <HowItWorksPage navigate={navigate} />;

      case '/about':
        return <AboutPage navigate={navigate} />;

      case '/future-updates':
      case '/roadmap':
        return <FutureUpdatesPage navigate={navigate} />;

      case '/login':
        return (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            navigate={navigate}
          />
        );

      case '/contact':
        return <ContactPage navigate={navigate} />;

      case '/':
      default:
        return (
          <HomePage
            navigate={navigate}
            onOpenQR={(p) => setQrModalProduce(p)}
            onPrint={(p) => setPrintModalProduce(p)}
          />
        );
    }
  };

  // Determine if it's the standalone public passport page (which has its own focused certificate styling)
  const isPublicPassportPage = currentPath.startsWith('/p/');

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF8] text-[#123524] antialiased selection:bg-[#8BC34A] selection:text-[#123524]">
      
      {/* Global Navigation Header (Skip on public passport if desired, or keep light) */}
      {!isPublicPassportPage && (
        <Navbar
          currentRoute={currentPath}
          navigate={navigate}
          activeUser={activeUser}
          onLogout={handleLogout}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Global Footer */}
      {!isPublicPassportPage && (
        <Footer navigate={navigate} />
      )}

      {/* Global Modals */}
      {qrModalProduce && (
        <QRResultModal
          produce={qrModalProduce}
          isOpen={true}
          onClose={() => setQrModalProduce(null)}
          onPrint={(p) => setPrintModalProduce(p)}
          onViewPublic={(produceId) => {
            setQrModalProduce(null);
            navigate(`/p/${produceId}`);
          }}
          onCreateAnother={() => {
            setQrModalProduce(null);
            navigate('/create');
          }}
          navigate={navigate}
        />
      )}

      {printModalProduce && (
        <PrintLabelModal
          produce={printModalProduce}
          isOpen={true}
          onClose={() => setPrintModalProduce(null)}
        />
      )}

    </div>
  );
}
