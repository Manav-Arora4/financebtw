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
  selectedSymbol: string | null;
  setSelectedSymbol: (symbol: string | null) => void;
  trackedSymbols: string[];
  addTrackedSymbol: (symbol: string) => void;
  removeTrackedSymbol: (symbol: string) => void;

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
  { symbol: 'NIFTY 50',   name: 'Nifty 50 Index',       price: 24154.90, change: -132.75, percent: -0.55, currency: 'INR' },
  { symbol: 'BANKNIFTY',  name: 'Nifty Bank Index',      price: 57262.40, change: -235.40, percent: -0.41, currency: 'INR' },
  { symbol: 'SENSEX',     name: 'BSE Sensex',            price: 77235.46, change: -492.70, percent: -0.63, currency: 'INR' },
  { symbol: 'RELIANCE',   name: 'Reliance Industries',   price: 1322.00,  change: 6.00,    percent: 0.46,  currency: 'INR' },
  { symbol: 'TCS',        name: 'Tata Consultancy',      price: 2280.00,  change: -33.20,  percent: -1.44, currency: 'INR' },
  { symbol: 'HDFCBANK',   name: 'HDFC Bank Ltd',         price: 723.00,   change: -6.00,   percent: -0.82, currency: 'INR' },
  { symbol: 'INFY',       name: 'Infosys Limited',       price: 1115.00,  change: -24.90,  percent: -2.18, currency: 'INR' },
  { symbol: 'ICICIBANK',  name: 'ICICI Bank Ltd',        price: 1412.00,  change: -3.20,   percent: -0.23, currency: 'INR' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel',         price: 1934.20,  change: -35.00,  percent: -1.78, currency: 'INR' },
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

  selectedSymbol: null,
  setSelectedSymbol: (symbol) => set((s) => {
    if (symbol && !s.trackedSymbols.includes(symbol)) {
      return { selectedSymbol: symbol, trackedSymbols: [...s.trackedSymbols, symbol] };
    }
    return { selectedSymbol: symbol };
  }),

  trackedSymbols: [],
  addTrackedSymbol: (symbol) => set((s) => ({
    trackedSymbols: s.trackedSymbols.includes(symbol) ? s.trackedSymbols : [...s.trackedSymbols, symbol],
    selectedSymbol: symbol,
  })),
  removeTrackedSymbol: (symbol) => set((s) => {
    const updated = s.trackedSymbols.filter((sym) => sym !== symbol);
    const nextSelected = s.selectedSymbol === symbol ? (updated[0] || null) : s.selectedSymbol;
    return { trackedSymbols: updated, selectedSymbol: nextSelected };
  }),

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
