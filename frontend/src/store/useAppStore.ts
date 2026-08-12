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
  { symbol: 'NIFTY 50', name: 'Nifty 50 Index', price: 24350.25, change: 185.4, percent: 0.77, currency: 'INR' },
  { symbol: 'BANKNIFTY', name: 'Nifty Bank Index', price: 51240.8, change: 410.2, percent: 0.81, currency: 'INR' },
  { symbol: 'SENSEX', name: 'BSE Sensex', price: 80120.45, change: 590.1, percent: 0.74, currency: 'INR' },
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries', price: 2985.5, change: 32.1, percent: 1.09, currency: 'INR' },
  { symbol: 'TCS.NS', name: 'Tata Consultancy', price: 4190.0, change: -15.5, percent: -0.37, currency: 'INR' },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank Ltd', price: 1645.2, change: 12.8, percent: 0.78, currency: 'INR' },
  { symbol: 'INFY.NS', name: 'Infosys Limited', price: 1875.4, change: 24.3, percent: 1.31, currency: 'INR' },
  { symbol: 'AAPL', name: 'Apple Inc.', price: 224.5, change: 1.85, percent: 0.83, currency: 'USD' },
  { symbol: 'NVDA', name: 'NVIDIA Corp', price: 118.2, change: 3.4, percent: 2.96, currency: 'USD' },
  { symbol: 'BTC/USD', name: 'Bitcoin', price: 62450.0, change: 1250.0, percent: 2.04, currency: 'USD' },
];

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed: boolean) => set({ sidebarCollapsed: collapsed }),

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
