import React from 'react';
import Header from './Header';
import Footer from './Footer';
import VisitorIncentive from '../common/VisitorIncentive';

const Layout = ({ children }) => {
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