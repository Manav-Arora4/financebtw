import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { MarketPage } from './pages/MarketPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { ScreenerPage } from './pages/ScreenerPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { ResearchPage } from './pages/ResearchPage';
import { ResearchHubPage } from './pages/ResearchHubPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { NewsPage } from './pages/NewsPage';
import { AlertsPage } from './pages/AlertsPage';
import { SettingsPage } from './pages/SettingsPage';
import './App.css';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="markets" element={<MarketPage />} />
            <Route path="watchlists" element={<WatchlistPage />} />
            <Route path="screener" element={<ScreenerPage />} />
            <Route path="portfolio" element={<PortfolioPage />} />
            <Route path="research" element={<ResearchPage />} />
            <Route path="research-hub" element={<ResearchHubPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            {/* Legacy route redirects */}
            <Route path="market" element={<Navigate to="/markets" replace />} />
            <Route path="chat" element={<Navigate to="/research" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
