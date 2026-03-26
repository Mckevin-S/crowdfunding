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
const MyProjects = lazy(() => import('@pages/Projects/MyProjects'));
const DashboardPorteur = lazy(() => import('@pages/DashboardPorteur'));
const DashboardInvestisseur = lazy(() => import('@pages/DashboardInvestisseur'));
const NotFound = lazy(() => import('@pages/NotFound'));
const PublicProfile = lazy(() => import('@pages/PublicProfile'));
const UserProfile = lazy(() => import('@pages/Profile/UserProfile'));
const EditProfile = lazy(() => import('@pages/Profile/EditProfile'));
const About = lazy(() => import('@pages/About'));
const Contact = lazy(() => import('@pages/Contact'));
const Messages = lazy(() => import('@pages/Messages'));
const KYCVerification = lazy(() => import('@pages/KYC/KYCVerification'));
const PaymentSuccess = lazy(() => import('@pages/Payments/PaymentSuccess'));

const AdminLayout = lazy(() => import('@components/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('@pages/Admin/AdminDashboard'));
const AdminUsers = lazy(() => import('@pages/Admin/AdminUsers'));
const AdminProjects = lazy(() => import('@pages/Admin/AdminProjects'));
const AdminKYC = lazy(() => import('@pages/Admin/AdminKYC'));
const AdminPayments = lazy(() => import('@pages/Admin/AdminPayments'));
const AdminAnalytics = lazy(() => import('@pages/Admin/AdminAnalytics'));
const AdminDisputes = lazy(() => import('@pages/Admin/AdminDisputes'));
const AdminConfig = lazy(() => import('@pages/Admin/AdminConfig'));
const AdminProfile = lazy(() => import('@pages/Admin/AdminProfile'));

import UserDashboardLayout from '../components/layout/UserDashboardLayout';

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
            {/* Private Routes with Persistent Dashboard Layout */}
            <Route element={<PrivateRoute><UserDashboardLayout /></PrivateRoute>}>
              <Route path="/porteur/dashboard" element={<DashboardPorteur />} />
              <Route path="/porteur/mes-projets" element={<MyProjects />} />
              <Route path="/investisseur/dashboard" element={<DashboardInvestisseur />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/kyc" element={<KYCVerification />} />
              <Route path="/projects/create" element={<PrivateRoute roles={['PORTEUR_PROJET', 'ADMIN']}><CreateProject /></PrivateRoute>} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/profile/edit" element={<EditProfile />} />
            </Route>
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/profile/:id" element={<PublicProfile />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<PrivateRoute roles={['ADMIN']}><AdminLayout><AdminDashboard /></AdminLayout></PrivateRoute>} />
            <Route path="/admin/users" element={<PrivateRoute roles={['ADMIN']}><AdminLayout><AdminUsers /></AdminLayout></PrivateRoute>} />
            <Route path="/admin/projects" element={<PrivateRoute roles={['ADMIN']}><AdminLayout><AdminProjects /></AdminLayout></PrivateRoute>} />
            <Route path="/admin/kyc" element={<PrivateRoute roles={['ADMIN']}><AdminLayout><AdminKYC /></AdminLayout></PrivateRoute>} />
            <Route path="/admin/payments" element={<PrivateRoute roles={['ADMIN']}><AdminLayout><AdminPayments /></AdminLayout></PrivateRoute>} />
            <Route path="/admin/analytics" element={<PrivateRoute roles={['ADMIN']}><AdminLayout><AdminAnalytics /></AdminLayout></PrivateRoute>} />
            <Route path="/admin/disputes" element={<PrivateRoute roles={['ADMIN']}><AdminLayout><AdminDisputes /></AdminLayout></PrivateRoute>} />
            <Route path="/admin/settings" element={<PrivateRoute roles={['ADMIN']}><AdminLayout><AdminConfig /></AdminLayout></PrivateRoute>} />
            <Route path="/admin/profile" element={<PrivateRoute roles={['ADMIN']}><AdminLayout><AdminProfile /></AdminLayout></PrivateRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
};

export default AppRoutes;