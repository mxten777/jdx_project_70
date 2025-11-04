import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Languages, Brain, MessageCircle, User } from 'lucide-react';
import clsx from 'clsx';
import { ToastProvider } from './ToastSystem';
import ScrollToTop from './ScrollToTop';

// Pages
import HomePage from '../pages/HomePage';
import ZLangPage from '../pages/ZLangPage';
import GenQuizPage from '../pages/GenQuizPage';
import TalkBridgePage from '../pages/TalkBridgePage';

const Layout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: '홈', description: 'Generation Bridge' },
    { path: '/zlang', icon: Languages, label: 'ZLang', description: '신조어 변환' },
    { path: '/genquiz', icon: Brain, label: 'GenQuiz', description: '세대공감 퀴즈' },
    { path: '/talkbridge', icon: MessageCircle, label: 'TalkBridge', description: '대화 리포터' },
  ];

  return (
  <div className="min-h-screen relative overflow-x-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 w-full max-w-full box-border" style={{maxWidth: '100vw', overflowX: 'hidden'}}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 w-full">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">GB</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Generation Bridge
                </h1>
                <p className="text-sm text-gray-600">세대소통 AI 플랫폼</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <motion.div key={item.path} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to={item.path}
                      className={clsx(
                        'relative px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 group',
                        isActive 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                      )}
                    >
                      <Icon size={18} />
                      <span className="font-medium">{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg -z-10"
                          initial={false}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <User size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Scroll to top on route change */}
      <ScrollToTop />

      {/* Main Content */}
  <main className="flex-1 w-full px-2 sm:px-4 md:px-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/zlang" element={<ZLangPage />} />
          <Route path="/genquiz" element={<GenQuizPage />} />
          <Route path="/talkbridge" element={<TalkBridgePage />} />
        </Routes>
      </main>

      {/* Mobile Navigation */}
  <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-white/20 px-2 py-2 z-50">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <motion.div key={item.path} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Link
                  to={item.path}
                  className={clsx(
                    'flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200',
                    isActive 
                      ? 'text-blue-600 bg-blue-50 transform scale-110' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <Icon size={20} />
                  <span className="text-xs font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="mobileActiveIndicator"
                      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"
                      initial={false}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <ToastProvider>
      <Router>
        <Layout />
      </Router>
    </ToastProvider>
  );
};

export default AppLayout;