import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import VisitorIncentive from '../common/VisitorIncentive';

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isDashboardRoute = 
    location.pathname.startsWith('/porteur') || 
    location.pathname.startsWith('/investisseur') ||
    ['/profile', '/messages', '/kyc', '/projects/create'].some(path => location.pathname.startsWith(path));

  if (isAdminRoute || isDashboardRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-12">
        {children}
      </main>
      <Footer />
      <VisitorIncentive />
    </div>
  );
};

export default Layout;