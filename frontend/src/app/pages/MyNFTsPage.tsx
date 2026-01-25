import React, { useState } from 'react';
import { NFTCard } from '@/app/components/organisms/NFTCard';
import { mockNFTs } from '@/app/utils/mockData';
import { TrendingUp, Award, Gavel, Package } from 'lucide-react';

export const MyNFTsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'owned' | 'created' | 'onAuction'>('owned');

  // Mock data - in a real app, this would be filtered by wallet address
  const ownedNFTs = mockNFTs.slice(0, 4);
  const createdNFTs = mockNFTs.slice(2, 5);
  const auctionNFTs = mockNFTs.filter(nft => nft.auctionEndTime);

  const tabs = [
    { id: 'owned' as const, label: 'Owned', icon: Package, count: ownedNFTs.length },
    { id: 'created' as const, label: 'Created', icon: Award, count: createdNFTs.length },
    { id: 'onAuction' as const, label: 'On Auction', icon: Gavel, count: auctionNFTs.length },
  ];

  const getCurrentNFTs = () => {
    switch (activeTab) {
      case 'owned':
        return ownedNFTs;
      case 'created':
        return createdNFTs;
      case 'onAuction':
        return auctionNFTs;
    }
  };

  const totalVolume = 45.6;
  const totalBids = 12;
  const totalWins = 8;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            My NFTs
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your digital assets and track your collection
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Volume</p>
                <p className="text-2xl font-bold text-foreground">
                  {totalVolume} <span className="text-lg text-purple-400">ETH</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-400">+12.5%</span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 backdrop-blur-sm border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Gavel className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Bids</p>
                <p className="text-2xl font-bold text-foreground">{totalBids}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Active auctions</p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 backdrop-blur-sm border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Award className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Auction Wins</p>
                <p className="text-2xl font-bold text-foreground">{totalWins}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Successful bids</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-2 border-b border-purple-500/20">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-b-2 border-purple-500 text-purple-400'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id
                    ? 'bg-purple-500/20 text-purple-300'
                    : 'bg-white/5 text-muted-foreground'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* NFT Grid */}
        <div>
          {getCurrentNFTs().length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {getCurrentNFTs().map((nft) => (
                <NFTCard key={nft.id} nft={nft} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Package className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">No NFTs Found</h3>
              <p className="text-muted-foreground mb-6">
                {activeTab === 'owned' && "You don't own any NFTs yet"}
                {activeTab === 'created' && "You haven't created any NFTs yet"}
                {activeTab === 'onAuction' && "You don't have any NFTs on auction"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
