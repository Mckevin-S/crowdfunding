import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../pages/Home';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import ProjectsExplore from '../pages/Projects/ProjectsExplore';
import ProjectDetails from '../pages/Projects/ProjectDetails';
import CreateProject from '../pages/Projects/CreateProject';
import Dashboard from '../pages/Dashboard';
import NotFound from '../pages/NotFound';
import PublicProfile from '../pages/PublicProfile';
import About from '../pages/About';
import Contact from '../pages/Contact';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import Messages from '../pages/Messages';
import KYCVerification from '../pages/KYC/KYCVerification';

import PaymentSuccess from '@pages/Payments/PaymentSuccess';

const AppRoutes = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/projects" element={<ProjectsExplore />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
          <Route path="/kyc" element={<PrivateRoute><KYCVerification /></PrivateRoute>} />
          <Route path="/projects/create" element={<PrivateRoute roles={['PORTEUR_PROJET', 'ADMIN']}><CreateProject /></PrivateRoute>} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/profile/:id" element={<PublicProfile />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default AppRoutes;