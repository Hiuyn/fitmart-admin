import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Users from './components/Users';
import Statistics from './components/Statistics';
import Settings from './components/Settings';
import Sidebar from './components/Sidebar';
import './styles.css';

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState('products');
  const [settings, setSettings] = useState({
    darkMode: false,
    compactSidebar: false,
    primaryColor: '#3498db',
    itemsPerPage: '10',
    showThumbnails: true,
    emailNotifications: true,
    desktopNotifications: false
  });

  // Áp dụng chế độ tối khi thay đổi cài đặt
  useEffect(() => {
    if (settings.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    // Áp dụng màu chủ đạo
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    
    // Áp dụng cài đặt sidebar
    if (settings.compactSidebar) {
      setCollapsed(true);
    }
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    
    // Lưu cài đặt vào localStorage để duy trì giữa các phiên
    localStorage.setItem('sportAdmin-settings', JSON.stringify(newSettings));
  };

  // Tải cài đặt từ localStorage khi khởi động ứng dụng
  useEffect(() => {
    const savedSettings = localStorage.getItem('sportAdmin-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);
  
  const renderPage = () => {
    switch (currentPage) {
      case 'products':
        return <Dashboard settings={settings} />;
      case 'users':
        return <Users settings={settings} />;
      case 'statistics':
        return <Statistics settings={settings} />;
      case 'settings':
        return <Settings settings={settings} updateSettings={updateSettings} />;
      default:
        return <Dashboard settings={settings} />;
    }
  };
  
  return (
    <div className={`app-container ${settings.darkMode ? 'dark-theme' : 'light-theme'}`}>
      <Sidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        settings={settings}
      />
      <div className={`main-content ${collapsed ? 'expanded' : ''}`}>
        {renderPage()}
      </div>
    </div>
  );
}

export default App; 