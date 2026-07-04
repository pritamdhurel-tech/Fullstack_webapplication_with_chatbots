import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import Home from "./pages/Home";
import Solutions from "./pages/Solutions";
import SolutionDetail from "./pages/SolutionDetail";
import PastWork from "./pages/PastWork";
import PastWorkDetail from "./pages/PastWorkDetail";
import CustomerFeedback from "./pages/CustomerFeedback";
import Gallery from "./pages/Gallery";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSolutions from "./pages/admin/AdminSolutions";
import AdminPastWork from "./pages/admin/AdminPastWork";
import AdminFeedback from "./pages/admin/AdminFeedback";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminArticles from "./pages/admin/AdminArticles";
import AdminEnquiries from "./pages/admin/AdminEnquiries";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="solutions" element={<Solutions />} />
        <Route path="solutions/:id" element={<SolutionDetail />} />
        <Route path="past-work" element={<PastWork />} />
        <Route path="past-work/:id" element={<PastWorkDetail />} />
        <Route path="feedback" element={<CustomerFeedback />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="events" element={<Events />} />
        <Route path="events/:id" element={<EventDetail />} />
        <Route path="articles" element={<Articles />} />
        <Route path="articles/:id" element={<ArticleDetail />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="solutions" element={<AdminSolutions />} />
        <Route path="past-work" element={<AdminPastWork />} />
        <Route path="feedback" element={<AdminFeedback />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="articles" element={<AdminArticles />} />
        <Route path="enquiries" element={<AdminEnquiries />} />
      </Route>
    </Routes>
  );
}
