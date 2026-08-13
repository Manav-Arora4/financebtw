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
  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Active nav (matches route path e.g. 'dashboard', 'markets')
  activeNavTab: string;
  setActiveNavTab: (tab: string) => void;

  // AI Panel
  aiPanelOpen: boolean;
  setAIPanelOpen: (open: boolean) => void;
  toggleAIPanel: () => void;
  aiPanelWidth: number;
  setAIPanelWidth: (w: number) => void;

  // Command Palette
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;

  // Symbol selection
  selectedSymbol: string;
  setSelectedSymbol: (symbol: string) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Auth modal
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;

  // Market tickers
  tickers: MarketTicker[];
  setTickers: (tickers: MarketTicker[]) => void;

  // Market
  selectedMarket: 'india' | 'usa' | 'crypto';
  setSelectedMarket: (market: 'india' | 'usa' | 'crypto') => void;
}

const DEFAULT_TICKERS: MarketTicker[] = [
  { symbol: 'NIFTY 50',   name: 'Nifty 50 Index',       price: 24734.85, change: 165.4,  percent: 0.67, currency: 'INR' },
  { symbol: 'BANKNIFTY',  name: 'Nifty Bank Index',      price: 51248.8,  change: 410.2,  percent: 0.81, currency: 'INR' },
  { symbol: 'SENSEX',     name: 'BSE Sensex',            price: 81330.56, change: 510.1,  percent: 0.63, currency: 'INR' },
  { symbol: 'RELIANCE',   name: 'Reliance Industries',   price: 2985.5,   change: 32.1,   percent: 1.09, currency: 'INR' },
  { symbol: 'TCS',        name: 'Tata Consultancy',      price: 4190.0,   change: 60.0,   percent: 1.45, currency: 'INR' },
  { symbol: 'HDFCBANK',   name: 'HDFC Bank Ltd',         price: 1645.2,   change: 29.5,   percent: 1.82, currency: 'INR' },
  { symbol: 'INFY',       name: 'Infosys Limited',       price: 1875.4,   change: 39.5,   percent: 2.15, currency: 'INR' },
  { symbol: 'ICICIBANK',  name: 'ICICI Bank Ltd',        price: 1180.5,   change: 11.2,   percent: 0.95, currency: 'INR' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel',         price: 1460.0,   change: 18.8,   percent: 1.30, currency: 'INR' },
];

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  activeNavTab: 'dashboard',
  setActiveNavTab: (tab) => set({ activeNavTab: tab }),

  aiPanelOpen: true,
  setAIPanelOpen: (open) => set({ aiPanelOpen: open }),
  toggleAIPanel: () => set((s) => ({ aiPanelOpen: !s.aiPanelOpen })),
  aiPanelWidth: 340,
  setAIPanelWidth: (w) => set({ aiPanelWidth: w }),

  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  toggleCommandPalette: () => set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),

  selectedSymbol: 'RELIANCE.NS',
  setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  isAuthModalOpen: false,
  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  tickers: DEFAULT_TICKERS,
  setTickers: (tickers) => set({ tickers }),

  selectedMarket: 'india',
  setSelectedMarket: (market) => set({ selectedMarket: market }),
}));
