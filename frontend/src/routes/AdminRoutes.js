import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import AdminDashboard from "../Admin/AdminDashboard";
import Layout from "../Admin/Layout";
import Category from "../Admin/Category";
import Game from "../Admin/Game";
import TermsConditions from "../Admin/TermsConditions";
import PrivacyPolicy from "../Admin/PrivacyPolicy";
import User from "../Admin/User";
import Contact from "../Admin/Contact";
import Blog from "../Admin/Blog";
import AdminProfile from "../Admin/AdminProfile";
import Faq from "../Admin/Faq";
import Transaction from "../Admin/Transaction";
import NotFound from "../Admin/NotFound";
import Subscriber from "../Admin/Subscriber";


const AdminRoutes = () => {

  useEffect(() => {
    document.title = `Admin • YOYO`;
    window.scrollTo(0, 0);
  }, []);


  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (role !== 'admin') {
      navigate('/')
    }
  }, [role])

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/category" element={<Category />} />
        <Route path="/games" element={<Game />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/user" element={<User />} />
        <Route path="/profile" element={<AdminProfile />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/order" element={<Transaction />} />
        <Route path="/subscriber" element={<Subscriber />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

export default AdminRoutes;