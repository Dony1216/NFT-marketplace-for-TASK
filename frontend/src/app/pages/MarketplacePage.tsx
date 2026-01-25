import React, { useState, useMemo } from 'react';
import { NFTCard } from '@/app/components/organisms/NFTCard';
import { SearchBar } from '@/app/components/molecules/SearchBar';
import { FilterChip } from '@/app/components/molecules/FilterChip';
import { mockNFTs, categories, blockchains, saleTypes } from '@/app/utils/mockData';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/app/components/atoms/Button';

export const MarketplacePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBlockchain, setSelectedBlockchain] = useState('All');
  const [selectedSaleType, setSelectedSaleType] = useState('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10]);
  const [sortBy, setSortBy] = useState<'recent' | 'price-low' | 'price-high' | 'popular'>('recent');
  const [showFilters, setShowFilters] = useState(true);

  // Filter and sort NFTs
  const filteredNFTs = useMemo(() => {
    let filtered = mockNFTs.filter(nft => {
      // Search filter
      const matchesSearch = nft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           nft.creator.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter
      const matchesCategory = selectedCategory === 'All' || nft.category === selectedCategory;
      
      // Blockchain filter
      const matchesBlockchain = selectedBlockchain === 'All' || 
                                nft.blockchain === selectedBlockchain.toLowerCase();
      
      // Sale type filter
      const matchesSaleType = selectedSaleType === 'All' || 
                              (selectedSaleType === 'Auction' && nft.auctionEndTime) ||
                              (selectedSaleType === 'Buy Now' && !nft.auctionEndTime);
      
      // Price range filter
      const price = nft.highestBid || nft.price;
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesBlockchain && matchesSaleType && matchesPrice;
    });

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.highestBid || a.price) - (b.highestBid || b.price));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.highestBid || b.price) - (a.highestBid || a.price));
        break;
      case 'popular':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      default:
        // recent - already in default order
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedBlockchain, selectedSaleType, priceRange, sortBy]);

  // Active filters
  const activeFilters = useMemo(() => {
    const filters = [];
    if (selectedCategory !== 'All') filters.push({ type: 'category', value: selectedCategory });
    if (selectedBlockchain !== 'All') filters.push({ type: 'blockchain', value: selectedBlockchain });
    if (selectedSaleType !== 'All') filters.push({ type: 'saleType', value: selectedSaleType });
    if (priceRange[0] !== 0 || priceRange[1] !== 10) {
      filters.push({ type: 'price', value: `${priceRange[0]}-${priceRange[1]} ETH` });
    }
    return filters;
  }, [selectedCategory, selectedBlockchain, selectedSaleType, priceRange]);

  const clearFilter = (type: string) => {
    switch (type) {
      case 'category':
        setSelectedCategory('All');
        break;
      case 'blockchain':
        setSelectedBlockchain('All');
        break;
      case 'saleType':
        setSelectedSaleType('All');
        break;
      case 'price':
        setPriceRange([0, 10]);
        break;
    }
  };

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedBlockchain('All');
    setSelectedSaleType('All');
    setPriceRange([0, 10]);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Explore Marketplace</h1>
          <p className="text-muted-foreground">
            Discover unique digital artworks and collectibles from talented creators
          </p>
        </div>

        {/* Search and Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          
          <div className="flex gap-4">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none px-4 py-3 pr-10 rounded-lg bg-white/5 border border-purple-500/20 text-foreground focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 cursor-pointer"
              >
                <option value="recent">Recent</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            </div>

            <Button
              variant="ghost"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {activeFilters.map((filter, index) => (
              <FilterChip
                key={index}
                label={filter.value}
                onRemove={() => clearFilter(filter.type)}
              />
            ))}
            <button
              onClick={clearAllFilters}
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          {showFilters && (
            <aside className="w-80 flex-shrink-0 hidden lg:block">
              <div className="sticky top-24 space-y-6">
                {/* Categories */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-purple-500/20">
                  <h3 className="text-lg font-semibold mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${
                          selectedCategory === category
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'hover:bg-white/5 text-muted-foreground'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Blockchain */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-purple-500/20">
                  <h3 className="text-lg font-semibold mb-4">Blockchain</h3>
                  <div className="space-y-2">
                    {blockchains.map((blockchain) => (
                      <button
                        key={blockchain}
                        onClick={() => setSelectedBlockchain(blockchain)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${
                          selectedBlockchain === blockchain
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : 'hover:bg-white/5 text-muted-foreground'
                        }`}
                      >
                        {blockchain}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sale Type */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-purple-500/20">
                  <h3 className="text-lg font-semibold mb-4">Sale Type</h3>
                  <div className="space-y-2">
                    {saleTypes.map((saleType) => (
                      <button
                        key={saleType}
                        onClick={() => setSelectedSaleType(saleType)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${
                          selectedSaleType === saleType
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'hover:bg-white/5 text-muted-foreground'
                        }`}
                      >
                        {saleType}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-purple-500/20">
                  <h3 className="text-lg font-semibold mb-4">Price Range (ETH)</h3>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseFloat(e.target.value)])}
                      className="w-full accent-purple-500"
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{priceRange[0]} ETH</span>
                      <span className="text-foreground font-semibold">{priceRange[1]} ETH</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* NFT Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <p className="text-muted-foreground">
                Showing {filteredNFTs.length} of {mockNFTs.length} NFTs
              </p>
            </div>

            {filteredNFTs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNFTs.map((nft) => (
                  <NFTCard key={nft.id} nft={nft} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <X className="w-10 h-10 text-purple-400" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">No NFTs Found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search query
                </p>
                <Button variant="primary" onClick={clearAllFilters}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
