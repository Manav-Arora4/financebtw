import { create } from 'zustand';

export interface MarketTicker {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percent: number;
  currency: string;
}

interface AppState {
  // Sidebar state
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Active Navigation Tab
  activeNavTab: string;
  setActiveNavTab: (tab: string) => void;

  // Market & workspace selection
  selectedMarket: 'india' | 'usa' | 'crypto';
  setSelectedMarket: (market: 'india' | 'usa' | 'crypto') => void;

  // Symbol selection for research
  selectedSymbol: string;
  setSelectedSymbol: (symbol: string) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Auth modal
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;

  // Live marquee ticker list
  tickers: MarketTicker[];
  setTickers: (tickers: MarketTicker[]) => void;
}

const DEFAULT_TICKERS: MarketTicker[] = [
  { symbol: 'NIFTY 50', name: 'Nifty 50 Index', price: 24734.85, change: 165.4, percent: 0.67, currency: 'INR' },
  { symbol: 'BANKNIFTY', name: 'Nifty Bank Index', price: 51248.8, change: 410.2, percent: 0.81, currency: 'INR' },
  { symbol: 'SENSEX', name: 'BSE Sensex', price: 81330.56, change: 510.1, percent: 0.63, currency: 'INR' },
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries', price: 2985.5, change: 32.1, percent: 1.09, currency: 'INR' },
  { symbol: 'TCS.NS', name: 'Tata Consultancy', price: 4190.0, change: 60.0, percent: 1.45, currency: 'INR' },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank Ltd', price: 1645.2, change: 29.5, percent: 1.82, currency: 'INR' },
  { symbol: 'INFY.NS', name: 'Infosys Limited', price: 1875.4, change: 39.5, percent: 2.15, currency: 'INR' },
  { symbol: 'ICICIBANK.NS', name: 'ICICI Bank Ltd', price: 1180.5, change: 11.2, percent: 0.95, currency: 'INR' },
  { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel', price: 1460.0, change: 18.8, percent: 1.30, currency: 'INR' },
];

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed: boolean) => set({ sidebarCollapsed: collapsed }),

  activeNavTab: 'Dashboard',
  setActiveNavTab: (tab: string) => set({ activeNavTab: tab }),

  selectedMarket: 'india',
  setSelectedMarket: (market) => set({ selectedMarket: market }),

  selectedSymbol: 'RELIANCE.NS',
  setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  isAuthModalOpen: false,
  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  tickers: DEFAULT_TICKERS,
  setTickers: (tickers) => set({ tickers }),
}));
