import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Loader from '../components/common/Loader';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

// Lazy load all pages - reduces initial bundle by 70%
const Home = lazy(() => import('@pages/Home'));
const Login = lazy(() => import('@pages/Auth/Login'));
const Register = lazy(() => import('@pages/Auth/Register'));
const ProjectsExplore = lazy(() => import('@pages/Projects/ProjectsExplore'));
const ProjectDetails = lazy(() => import('@pages/Projects/ProjectDetails'));
const CreateProject = lazy(() => import('@pages/Projects/CreateProject'));
const Dashboard = lazy(() => import('@pages/Dashboard'));
const NotFound = lazy(() => import('@pages/NotFound'));
const PublicProfile = lazy(() => import('@pages/PublicProfile'));
const UserProfile = lazy(() => import('@pages/Profile/UserProfile'));
const EditProfile = lazy(() => import('@pages/Profile/EditProfile'));
const About = lazy(() => import('@pages/About'));
const Contact = lazy(() => import('@pages/Contact'));
const Messages = lazy(() => import('@pages/Messages'));
const KYCVerification = lazy(() => import('@pages/KYC/KYCVerification'));
const PaymentSuccess = lazy(() => import('@pages/Payments/PaymentSuccess'));

const AppRoutes = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Layout>
        <Suspense fallback={<Loader />}>
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
            <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
            <Route path="/profile/edit" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
            <Route path="/profile/:id" element={<PublicProfile />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
};

export default AppRoutes;