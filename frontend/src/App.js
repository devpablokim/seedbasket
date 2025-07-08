import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Diary from './pages/Diary';
import AskAI from './pages/AskAI';
import Markets from './pages/Markets';
import News from './pages/News';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <PrivateRoute>
                <Navbar />
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/diary" element={
              <PrivateRoute>
                <Navbar />
                <Diary />
              </PrivateRoute>
            } />
            <Route path="/ask-ai" element={
              <PrivateRoute>
                <Navbar />
                <AskAI />
              </PrivateRoute>
            } />
            <Route path="/markets" element={
              <PrivateRoute>
                <Navbar />
                <Markets />
              </PrivateRoute>
            } />
            <Route path="/news" element={
              <PrivateRoute>
                <Navbar />
                <News />
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;