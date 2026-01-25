import React, { useState } from 'react';
import { NFTCard } from '@/app/components/organisms/NFTCard';
import { SearchBar } from '@/app/components/molecules/SearchBar';
import { mockNFTs } from '@/app/utils/mockData';
import { ChevronDown, Grid3x3, LayoutGrid } from 'lucide-react';

export const AllNFTsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'price-low' | 'price-high' | 'popular'>('recent');
  const [gridCols, setGridCols] = useState<3 | 4>(4);

  // Filter and sort NFTs
  const filteredNFTs = mockNFTs
    .filter(nft => 
      nft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nft.creator.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.highestBid || a.price) - (b.highestBid || b.price);
        case 'price-high':
          return (b.highestBid || b.price) - (a.highestBid || a.price);
        case 'popular':
          return b.likes - a.likes;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            All NFTs
          </h1>
          <p className="text-muted-foreground text-lg">
            Browse our complete collection of {mockNFTs.length} unique digital assets
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-purple-500/20">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <SearchBar 
              value={searchQuery} 
              onChange={setSearchQuery}
              placeholder="Search by name or creator..."
            />
            
            <div className="flex gap-4 items-center">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none px-4 py-3 pr-10 rounded-lg bg-white/5 border border-purple-500/20 text-foreground focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 cursor-pointer"
                >
                  <option value="recent">Most Recent</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>

              {/* Grid Layout Toggle */}
              <div className="flex gap-2 p-1 rounded-lg bg-white/5 border border-purple-500/20">
                <button
                  onClick={() => setGridCols(3)}
                  className={`p-2 rounded transition-all duration-200 ${
                    gridCols === 3 
                      ? 'bg-purple-500/20 text-purple-300' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setGridCols(4)}
                  className={`p-2 rounded transition-all duration-200 ${
                    gridCols === 4 
                      ? 'bg-purple-500/20 text-purple-300' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredNFTs.length === mockNFTs.length 
              ? `Showing all ${mockNFTs.length} NFTs`
              : `Found ${filteredNFTs.length} of ${mockNFTs.length} NFTs`
            }
          </p>
        </div>

        {/* NFT Grid */}
        {filteredNFTs.length > 0 ? (
          <div className={`grid gap-6 ${
            gridCols === 3 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
          }`}>
            {filteredNFTs.map((nft) => (
              <NFTCard key={nft.id} nft={nft} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-purple-500/10 flex items-center justify-center">
              <LayoutGrid className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No NFTs Found</h3>
            <p className="text-muted-foreground mb-6">
              Try searching with different keywords
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all duration-300"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
