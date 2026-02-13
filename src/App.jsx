import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './store/store';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MarketDetail from './pages/MarketDetail';
import CreateMarket from './pages/CreateMarket';
import Leaderboard from './pages/Leaderboard';
import Portfolio from './pages/Portfolio';

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-bg">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/market/:id" element={<MarketDetail />} />
            <Route path="/create" element={<CreateMarket />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/portfolio" element={<Portfolio />} />
          </Routes>
        </div>
      </BrowserRouter>
    </StoreProvider>
  );
}
