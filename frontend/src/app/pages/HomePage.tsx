import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/atoms/Button";
import { NFTCard } from "../components/organisms/NFTCard";
import { CreatorCard } from "../components/molecules/CreatorCard";
import { useNFTs } from "../../context/NFTContext";
import { mockCreators } from "../utils/mockData";
import { TrendingUp, Zap, Shield, Globe } from "lucide-react";

export const HomePage: React.FC = () => {
  const { nfts } = useNFTs();

  // Safe derived data
  const featuredNFT = nfts[0];
  const trendingNFTs = nfts.slice(0, 4);
  const liveAuctions = nfts.filter(nft => nft.auctionEndTime).slice(0, 4);
  const topCreators = mockCreators.slice(0, 4);

  return (
    <div className="min-h-screen">

      {/* ================= HERO ================= */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Text */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30">
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-purple-300">
                  Welcome to the Future of Digital Art
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                  Discover, Collect
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  & Sell Extraordinary
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">
                  NFTs
                </span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-lg">
                The premier marketplace for digital creators and collectors.
              </p>

              <div className="flex gap-4">
                <Link to="/marketplace">
                  <Button variant="primary" size="lg">Explore NFTs</Button>
                </Link>
                <Link to="/create">
                  <Button variant="outline" size="lg">Create NFT</Button>
                </Link>
              </div>
            </div>

            {/* Featured NFT */}
            <div className="relative">
              {featuredNFT ? (
                <div className="animate-float">
                  <NFTCard nft={featuredNFT} />
                </div>
              ) : (
                <div className="p-12 rounded-2xl border border-purple-500/20 text-center text-muted-foreground">
                  No NFTs minted yet
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-20">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">
          {[Shield, Globe, TrendingUp].map((Icon, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl bg-white/5 border border-purple-500/20"
            >
              <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6">
                <Icon className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {i === 0 ? "Secure & Reliable" : i === 1 ? "Global Community" : "Trending Markets"}
              </h3>
              <p className="text-muted-foreground">
                Built on blockchain technology.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= TRENDING ================= */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex justify-between mb-12">
            <h2 className="text-4xl font-bold">Trending NFTs</h2>
            <Link to="/marketplace">
              <Button variant="ghost">View All</Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {trendingNFTs.length > 0 ? (
              trendingNFTs.map(nft => <NFTCard key={nft.id} nft={nft} />)
            ) : (
              <p className="text-muted-foreground">No trending NFTs yet</p>
            )}
          </div>
        </div>
      </section>

      {/* ================= AUCTIONS ================= */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12">Live Auctions</h2>

          <div className="grid md:grid-cols-4 gap-6">
            {liveAuctions.length > 0 ? (
              liveAuctions.map(nft => <NFTCard key={nft.id} nft={nft} />)
            ) : (
              <p className="text-muted-foreground">No live auctions</p>
            )}
          </div>
        </div>
      </section>

      {/* ================= CREATORS ================= */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">
            Top Creators
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {topCreators.map((creator, i) => (
              <CreatorCard key={creator.id} creator={creator} rank={i + 1} />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
