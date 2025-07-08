import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import './i18n/i18n';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Diary from './pages/Diary';
import AskAI from './pages/AskAI';
import Markets from './pages/Markets';
import News from './pages/News';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import LanguageWrapper from './components/LanguageWrapper';

function LayoutWithNavbar() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Korean routes */}
            <Route path="/ko" element={<LanguageWrapper />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route element={<PrivateRoute><LayoutWithNavbar /></PrivateRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="diary" element={<Diary />} />
                <Route path="ask-ai" element={<AskAI />} />
                <Route path="markets" element={<Markets />} />
                <Route path="news" element={<News />} />
              </Route>
            </Route>
            
            {/* English routes (default) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<PrivateRoute><LayoutWithNavbar /></PrivateRoute>}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/diary" element={<Diary />} />
              <Route path="/ask-ai" element={<AskAI />} />
              <Route path="/markets" element={<Markets />} />
              <Route path="/news" element={<News />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;