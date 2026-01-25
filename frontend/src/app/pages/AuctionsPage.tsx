import React, { useState, useMemo } from 'react';
import { NFTCard } from '@/app/components/organisms/NFTCard';
import { SearchBar } from '@/app/components/molecules/SearchBar';
import { mockNFTs } from '@/app/utils/mockData';
import { ChevronDown, Clock } from 'lucide-react';

export const AuctionsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'ending-soon' | 'newly-listed' | 'price-high' | 'price-low'>('ending-soon');

  // Get only NFTs with active auctions
  const auctionNFTs = useMemo(() => {
    let filtered = mockNFTs.filter(nft => 
      nft.auctionEndTime &&
      (nft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       nft.creator.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Sort
    switch (sortBy) {
      case 'ending-soon':
        filtered.sort((a, b) => {
          if (!a.auctionEndTime || !b.auctionEndTime) return 0;
          return a.auctionEndTime.getTime() - b.auctionEndTime.getTime();
        });
        break;
      case 'newly-listed':
        filtered.reverse();
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.highestBid || b.price) - (a.highestBid || a.price));
        break;
      case 'price-low':
        filtered.sort((a, b) => (a.highestBid || a.price) - (b.highestBid || b.price));
        break;
    }

    return filtered;
  }, [searchQuery, sortBy]);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 backdrop-blur-sm mb-6">
            <Clock className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="text-sm text-purple-300">Live Auctions</span>
          </div>
          
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Active Auctions
          </h1>
          <p className="text-muted-foreground text-lg">
            Place your bids on {auctionNFTs.length} exclusive NFTs before time runs out
          </p>
        </div>

        {/* Search and Sort Bar */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-purple-500/20">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <SearchBar 
              value={searchQuery} 
              onChange={setSearchQuery}
              placeholder="Search auctions..."
            />
            
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none px-4 py-3 pr-10 rounded-lg bg-white/5 border border-purple-500/20 text-foreground focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 cursor-pointer"
              >
                <option value="ending-soon">Ending Soon</option>
                <option value="newly-listed">Newly Listed</option>
                <option value="price-high">Highest Bid</option>
                <option value="price-low">Lowest Bid</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent backdrop-blur-sm border border-purple-500/20">
            <p className="text-sm text-muted-foreground mb-2">Total Auctions</p>
            <p className="text-3xl font-bold">{auctionNFTs.length}</p>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-transparent backdrop-blur-sm border border-cyan-500/20">
            <p className="text-sm text-muted-foreground mb-2">Total Volume</p>
            <p className="text-3xl font-bold">
              {auctionNFTs.reduce((sum, nft) => sum + (nft.highestBid || nft.price), 0).toFixed(1)} 
              <span className="text-lg text-cyan-400 ml-2">ETH</span>
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent backdrop-blur-sm border border-blue-500/20">
            <p className="text-sm text-muted-foreground mb-2">Average Bid</p>
            <p className="text-3xl font-bold">
              {(auctionNFTs.reduce((sum, nft) => sum + (nft.highestBid || nft.price), 0) / auctionNFTs.length).toFixed(2)}
              <span className="text-lg text-blue-400 ml-2">ETH</span>
            </p>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {auctionNFTs.length > 0 
              ? `Showing ${auctionNFTs.length} active auction${auctionNFTs.length !== 1 ? 's' : ''}`
              : 'No active auctions found'
            }
          </p>
        </div>

        {/* NFT Grid */}
        {auctionNFTs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {auctionNFTs.map((nft) => (
              <NFTCard key={nft.id} nft={nft} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Clock className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No Auctions Found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery 
                ? 'Try adjusting your search query'
                : 'Check back soon for new auctions'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
