// src/app/pages/AllNFTsPage.tsx
import React, { useEffect, useState } from "react";
import { NFTCard } from "../components/organisms/NFTCard";
import { SearchBar } from "../components/molecules/SearchBar";
import { ChevronDown, Grid3x3, LayoutGrid } from "lucide-react";
import { getNFTContract, getMarketplaceContract } from "../../web3";
import { NFT_ADDRESS, MARKETPLACE_ADDRESS } from "../../constants";
import { ethers } from "ethers";

interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number; // updated price from Marketplace
  likes: number;
  creator: string;
  owner: string;
  category: string;
}

export const AllNFTsPage: React.FC = () => {
  const [nfts, setNFTs] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "price-low" | "price-high" | "popular">("recent");
  const [gridCols, setGridCols] = useState<3 | 4>(4);

  const fetchAllNFTs = async () => {
    if (!window.ethereum) return;
    setLoading(true);

    try {
      const nftContract = await getNFTContract();
      const marketplace = await getMarketplaceContract();
      const totalSupply = Number(await nftContract.tokenCount());
      const items: NFT[] = [];

      for (let tokenId = 1; tokenId <= totalSupply; tokenId++) {
        try {
          const tokenURI = await nftContract.tokenURI(tokenId);
          const owner = await nftContract.ownerOf(tokenId);

          const res = await fetch(tokenURI);
          const metadata = await res.json();

          let price = 0;

          // Try fetching live price from Marketplace
          try {
            const listingIndex = await marketplace.listingIndex(NFT_ADDRESS, tokenId);
            const allListings = await marketplace.getAllListings();
            if (Number(listingIndex) < allListings.length) {
              const currentListing = allListings[Number(listingIndex)];
              if (currentListing && currentListing.price) {
                price = Number(ethers.formatEther(currentListing.price));
              }
            }
            console.log(price)
          } catch (err) {
            console.log(`NFT #${tokenId} not listed or marketplace error`, err);
          }

          items.push({
            id: tokenId.toString(),
            name: metadata.name ?? "Untitled NFT",
            description: metadata.description ?? "",
            image: metadata.image,
            owner,
            price,
            category: metadata.category ?? "uncategorized",
            likes: 0,
            creator: metadata.creator ?? owner,
          });
        } catch (err) {
          console.warn(`Failed to load NFT #${tokenId}`, err);
        }
      }

      setNFTs(items.reverse()); // newest first
    } catch (err) {
      console.error("Failed to fetch NFTs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNFTs();
  }, []);

  const filteredNFTs = nfts
    .filter(
      (nft) =>
        nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nft.creator.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "popular":
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
            Browse {filteredNFTs.length} unique digital assets
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mb-8 p-4 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-purple-500/20">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by name or creator..."
            />
            <div className="flex gap-4 items-center">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none px-4 py-3 pr-10 rounded-lg bg-white/5 border border-purple-500/20"
                >
                  <option value="recent">Most Recent</option>
                  <option value="price-low">Price: Low → High</option>
                  <option value="price-high">Price: High → Low</option>
                  <option value="popular">Most Popular</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5" />
              </div>
              <div className="flex gap-2 p-1 rounded-lg bg-white/5 border border-purple-500/20">
                <button
                  onClick={() => setGridCols(3)}
                  className={`p-2 rounded ${gridCols === 3 ? "bg-purple-500/20 text-purple-300" : "text-muted-foreground"}`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setGridCols(4)}
                  className={`p-2 rounded ${gridCols === 4 ? "bg-purple-500/20 text-purple-300" : "text-muted-foreground"}`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <p className="text-center text-muted-foreground">
            Loading NFTs from blockchain...
          </p>
        ) : filteredNFTs.length > 0 ? (
          <div
            className={`grid gap-6 ${gridCols === 3 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"}`}
          >
            {filteredNFTs.map((nft) => (
              <NFTCard key={nft.id} nft={nft} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <LayoutGrid className="w-12 h-12 mx-auto text-purple-400 mb-4" />
            <h3 className="text-2xl font-semibold">No NFTs Found</h3>
            <p className="text-muted-foreground">Try adjusting your search</p>
          </div>
        )}
      </div>
    </div>
  );
};
