import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from '@/app/components/organisms/Navbar';
import { Footer } from '@/app/components/organisms/Footer';
import { HomePage } from '@/app/pages/HomePage';
import { MarketplacePage } from '@/app/pages/MarketplacePage';
import { AllNFTsPage } from '@/app/pages/AllNFTsPage';
import { NFTDetailPage } from '@/app/pages/NFTDetailPage';
import { MyNFTsPage } from '@/app/pages/MyNFTsPage';
import { CreateNFTPage } from '@/app/pages/CreateNFTPage';
import { AuctionsPage } from '@/app/pages/AuctionsPage';

export default function App() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const handleConnectWallet = () => {
    // Simulate wallet connection
    const mockAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f92c3';
    setWalletAddress(mockAddress);
  };

  const handleDisconnectWallet = () => {
    setWalletAddress(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar 
          walletAddress={walletAddress}
          onConnectWallet={handleConnectWallet}
          onDisconnectWallet={handleDisconnectWallet}
        />
        
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/all-nfts" element={<AllNFTsPage />} />
            <Route path="/nft/:id" element={<NFTDetailPage />} />
            <Route path="/auctions" element={<AuctionsPage />} />
            <Route 
              path="/my-nfts" 
              element={walletAddress ? <MyNFTsPage /> : <Navigate to="/" replace />} 
            />
            <Route 
              path="/create" 
              element={walletAddress ? <CreateNFTPage /> : <Navigate to="/" replace />} 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
