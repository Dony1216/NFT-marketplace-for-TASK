// src/app/pages/MarketplacePage.tsx
import React, { useState, useEffect, useMemo } from "react";
import { NFTCard } from "../components/organisms/NFTCard";
import { SearchBar } from "../components/molecules/SearchBar";
import { FilterChip } from "../components/molecules/FilterChip";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { Button } from "../components/atoms/Button";
import { getNFTContract, getMarketplaceContract } from "../../web3";
import { ethers } from "ethers";
import { NFT_ADDRESS } from "../../constants";

const blockchains = ["All", "Ethereum", "Polygon", "Solana"];
const saleTypes = ["All", "Buy Now", "Auction"];

interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  likes: number;
  creator: string;
  owner: string;
  category: string;
  auctionEndTime?: number;
  highestBid?: number;
}

export const MarketplacePage: React.FC = () => {
  const [nfts, setNFTs] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBlockchain, setSelectedBlockchain] = useState("All");
  const [selectedSaleType, setSelectedSaleType] = useState("All");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20]);
  const [sortBy, setSortBy] =
    useState<"recent" | "price-low" | "price-high" | "popular">("recent");
  const [showFilters, setShowFilters] = useState(true);

  /* ---------------- FETCH ALL NFTS + MARKETPLACE PRICE ---------------- */
const fetchMarketplaceNFTs = async () => {
  if (!window.ethereum) return;
  setLoading(true);
  try {
    const marketplace = await getMarketplaceContract();
    const nftContract = await getNFTContract();
    const totalSupply = Number(await nftContract.tokenCount());
    const items: NFT[] = [];

    for (let tokenId = 1; tokenId <= totalSupply; tokenId++) {
      try {
        const sold = await marketplace.isSold(NFT_ADDRESS, tokenId);
        if (sold) continue; // Skip sold NFTs

        const tokenURI = await nftContract.tokenURI(tokenId);
        const owner = await nftContract.ownerOf(tokenId);

        const res = await fetch(tokenURI);
        const metadata = await res.json();

        items.push({
          id: tokenId.toString(),
          name: metadata.name ?? "Untitled NFT",
          description: metadata.description ?? "",
          image: metadata.image,
          owner,
          price: metadata.price ?? 0,
          category: metadata.category ?? "uncategorized",
          likes: 0,
          creator: metadata.creator ?? owner,
        });
      } catch (err) {
        console.warn(`Failed to load NFT #${tokenId}`, err);
      }
    }

    setNFTs(items.reverse());
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchMarketplaceNFTs();
  }, []);

  /* ---------------- FILTER + SORT ---------------- */
  const filteredNFTs = useMemo(() => {
    let filtered = nfts.filter((nft) => {
      const matchesSearch =
        nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nft.creator.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesBlockchain =
        selectedBlockchain === "All" ||
        nft.category.toLowerCase() === selectedBlockchain.toLowerCase(); // adjust if blockchain is stored differently

      const matchesSaleType =
        selectedSaleType === "All" ||
        (selectedSaleType === "Auction" && nft.auctionEndTime) ||
        (selectedSaleType === "Buy Now" && !nft.auctionEndTime);

      const priceToCheck = nft.highestBid ?? nft.price;
      const matchesPrice =
        priceToCheck >= priceRange[0] && priceToCheck <= priceRange[1];

      return (
        matchesSearch && matchesBlockchain && matchesSaleType && matchesPrice
      );
    });

    switch (sortBy) {
      case "price-low":
        filtered.sort(
          (a, b) => (a.highestBid ?? a.price) - (b.highestBid ?? b.price)
        );
        break;
      case "price-high":
        filtered.sort(
          (a, b) => (b.highestBid ?? b.price) - (a.highestBid ?? a.price)
        );
        break;
      case "popular":
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      default:
        break;
    }

    return filtered;
  }, [nfts, searchQuery, selectedBlockchain, selectedSaleType, priceRange, sortBy]);

  const activeFilters = useMemo(() => {
    const filters: { type: string; value: string }[] = [];
    if (selectedBlockchain !== "All")
      filters.push({ type: "blockchain", value: selectedBlockchain });
    if (selectedSaleType !== "All")
      filters.push({ type: "saleType", value: selectedSaleType });
    if (priceRange[0] !== 0 || priceRange[1] !== 10)
      filters.push({
        type: "price",
        value: `${priceRange[0]}–${priceRange[1]} ETH`,
      });
    return filters;
  }, [selectedBlockchain, selectedSaleType, priceRange]);

  const clearFilter = (type: string) => {
    if (type === "blockchain") setSelectedBlockchain("All");
    if (type === "saleType") setSelectedSaleType("All");
    if (type === "price") setPriceRange([0, 20]);
  };

  const clearAllFilters = () => {
    setSelectedBlockchain("All");
    setSelectedSaleType("All");
    setPriceRange([0, 20]);
    setSearchQuery("");
  };

  /* ---------------- RENDER ---------------- */
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Explore Marketplace</h1>
          <p className="text-muted-foreground">
            Discover NFTs minted on-chain
          </p>
        </div>

        {/* Search & Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <div className="flex gap-4">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none px-4 py-3 pr-10 rounded-lg bg-white/5 border border-purple-500/20"
              >
                <option value="recent">Recent</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="popular">Most Popular</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>

            <Button variant="ghost" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-6">
            {activeFilters.map((filter, i) => (
              <FilterChip
                key={i}
                label={filter.value}
                onRemove={() => clearFilter(filter.type)}
              />
            ))}
            <button
              onClick={clearAllFilters}
              className="text-sm text-purple-400"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex gap-8">
          {/* Sidebar */}
          {showFilters && (
            <aside className="w-80 hidden lg:block">
              <div className="space-y-6 sticky top-24">
                {/* Blockchain */}
                <div className="p-6 rounded-2xl bg-white/5 border border-purple-500/20">
                  <h3 className="font-semibold mb-4">Blockchain</h3>
                  {blockchains.map((bc) => (
                    <button
                      key={bc}
                      onClick={() => setSelectedBlockchain(bc)}
                      className={`w-full text-left px-4 py-2 rounded-lg ${
                        selectedBlockchain === bc
                          ? "bg-purple-500/20 text-purple-300"
                          : "text-muted-foreground hover:bg-white/5"
                      }`}
                    >
                      {bc}
                    </button>
                  ))}
                </div>

                {/* Sale Type */}
                <div className="p-6 rounded-2xl bg-white/5 border border-purple-500/20">
                  <h3 className="font-semibold mb-4">Sale Type</h3>
                  {saleTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedSaleType(type)}
                      className={`w-full text-left px-4 py-2 rounded-lg ${
                        selectedSaleType === type
                          ? "bg-cyan-500/20 text-cyan-300"
                          : "text-muted-foreground hover:bg-white/5"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {/* Price */}
                <div className="p-6 rounded-2xl bg-white/5 border border-purple-500/20">
                  <h3 className="font-semibold mb-4">Max Price (ETH)</h3>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="0.01"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([0, parseFloat(e.target.value)])
                    }
                    className="w-full accent-purple-500"
                  />
                  <p className="text-sm mt-2">
                    Up to <strong>{priceRange[1]} ETH</strong>
                  </p>
                </div>
              </div>
            </aside>
          )}

          {/* Grid */}
          <div className="flex-1">
            <p className="text-muted-foreground mb-6">
              Showing {filteredNFTs.length} of {nfts.length} NFTs
            </p>

            {loading ? (
              <p className="text-center text-muted-foreground">Loading NFTs...</p>
            ) : filteredNFTs.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6">
                {filteredNFTs.map((nft) => (
                  <NFTCard key={nft.id} nft={nft} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <X className="w-12 h-12 mx-auto text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold">No NFTs Found</h3>
                <Button className="mt-6" onClick={clearAllFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
