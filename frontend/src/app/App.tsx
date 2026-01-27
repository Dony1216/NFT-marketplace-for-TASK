import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAccount } from 'wagmi';

import { Navbar } from './components/organisms/Navbar';
import { Footer } from './components/organisms/Footer';

import { HomePage } from './pages/HomePage';
import { MarketplacePage } from './pages/MarketplacePage';
import { AllNFTsPage } from './pages/AllNFTsPage';
import { NFTDetailPage } from './pages/NFTDetailPage';
import { MyNFTsPage } from './pages/MyNFTsPage';
import { CreateNFTPage } from './pages/CreateNFTPage';
import { AuctionsPage } from './pages/AuctionsPage';

export default function App() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/all-nfts" element={<AllNFTsPage />} />
          <Route path="/nft/:id" element={<NFTDetailPage />} />
          <Route path="/auctions" element={<AuctionsPage />} />

          {/* 🔐 Protected Routes */}
          <Route
            path="/my-nfts"
            element={isConnected ? <MyNFTsPage /> : <Navigate to="/" replace />}
          />
          <Route
            path="/create"
            element={isConnected ? <CreateNFTPage /> : <Navigate to="/" replace />}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
