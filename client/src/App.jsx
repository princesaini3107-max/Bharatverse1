import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import { useAuth } from './lib/auth.jsx';
import { Loader } from './components/ui/UI.jsx';

import Home from './pages/Home.jsx';
import Explore from './pages/Explore.jsx';
import StateDetail from './pages/StateDetail.jsx';
import CityDetail from './pages/CityDetail.jsx';
import PlaceDetail from './pages/PlaceDetail.jsx';
import CultureHub from './pages/CultureHub.jsx';
import ArticleDetail from './pages/ArticleDetail.jsx';
import Museum from './pages/Museum.jsx';
import Artisans from './pages/Artisans.jsx';
import ArtisanDetail from './pages/ArtisanDetail.jsx';
import HeritageAtRisk from './pages/HeritageAtRisk.jsx';
import Learn from './pages/Learn.jsx';
import Marketplace from './pages/Marketplace.jsx';
import VendorDetail from './pages/VendorDetail.jsx';
import Guide from './pages/Guide.jsx';
import Planner from './pages/Planner.jsx';
import Login from './pages/Login.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import VendorRegister from './pages/VendorRegister.jsx';
import VendorDashboard from './pages/VendorDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import NotFound from './pages/NotFound.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
  window.scrollTo(0, 0);
}, [pathname]);
  return null;
}

function Protected({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader label="Checking your session…" />;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/state/:id" element={<StateDetail />} />
          <Route path="/city/:id" element={<CityDetail />} />
          <Route path="/place/:id" element={<PlaceDetail />} />
          <Route path="/culture" element={<CultureHub />} />
          <Route path="/culture/:id" element={<ArticleDetail />} />
          <Route path="/museum" element={<Museum />} />
          <Route path="/artisans" element={<Artisans />} />
          <Route path="/artisans/:id" element={<ArtisanDetail />} />
          <Route path="/heritage-at-risk" element={<HeritageAtRisk />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/vendor/register" element={<VendorRegister />} />
          <Route path="/vendor/dashboard" element={<Protected role="vendor"><VendorDashboard /></Protected>} />
          <Route path="/vendor/:id" element={<VendorDetail />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Protected><UserDashboard /></Protected>} />
          <Route path="/admin" element={<Protected role="admin"><AdminDashboard /></Protected>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
