import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/app/components/atoms/Button';
import { NFTCard } from '@/app/components/organisms/NFTCard';
import { CreatorCard } from '@/app/components/molecules/CreatorCard';
import { mockNFTs, mockCreators } from '@/app/utils/mockData';
import { TrendingUp, Zap, Shield, Globe } from 'lucide-react';

export const HomePage: React.FC = () => {
  const featuredNFT = mockNFTs[0];
  const trendingNFTs = mockNFTs.slice(0, 4);
  const liveAuctions = mockNFTs.filter(nft => nft.auctionEndTime).slice(0, 4);
  const topCreators = mockCreators.slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Hero Text */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 backdrop-blur-sm">
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-purple-300">Welcome to the Future of Digital Art</span>
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
                Explore unique artworks, rare collectibles, and exclusive drops from top artists.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/marketplace">
                  <Button variant="primary" size="lg">
                    Explore NFTs
                  </Button>
                </Link>
                <Link to="/create">
                  <Button variant="outline" size="lg">
                    Create NFT
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div>
                  <p className="text-3xl font-bold text-foreground">240K+</p>
                  <p className="text-sm text-muted-foreground">Artworks</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">100K+</p>
                  <p className="text-sm text-muted-foreground">Artists</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground">340K+</p>
                  <p className="text-sm text-muted-foreground">Collectors</p>
                </div>
              </div>
            </div>

            {/* Right: Featured NFT Card */}
            <div className="relative">
              {/* Floating Animation Container */}
              <div className="animate-float">
                <NFTCard nft={featuredNFT} />
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure & Reliable</h3>
              <p className="text-muted-foreground">
                Built on blockchain technology with industry-leading security standards to protect your assets.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Global Community</h3>
              <p className="text-muted-foreground">
                Join thousands of creators and collectors from around the world in the Web3 revolution.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Trending Markets</h3>
              <p className="text-muted-foreground">
                Discover trending collections and top-performing NFTs with real-time market insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Collections */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Trending Collections</h2>
              <p className="text-muted-foreground">Explore the most popular NFTs right now</p>
            </div>
            <Link to="/marketplace">
              <Button variant="ghost">View All</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingNFTs.map((nft) => (
              <NFTCard key={nft.id} nft={nft} />
            ))}
          </div>
        </div>
      </section>

      {/* Live Auctions */}
      <section className="py-20 relative">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Live Auctions</h2>
              <p className="text-muted-foreground">Place your bids on exclusive NFTs</p>
            </div>
            <Link to="/auctions">
              <Button variant="ghost">View All Auctions</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {liveAuctions.map((nft) => (
              <NFTCard key={nft.id} nft={nft} />
            ))}
          </div>
        </div>
      </section>

      {/* Top Creators */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Top Creators</h2>
            <p className="text-muted-foreground">Meet the most influential artists in our community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topCreators.map((creator, index) => (
              <CreatorCard key={creator.id} creator={creator} rank={index + 1} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-blue-500/10" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Start Your NFT Journey Today
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Create, buy, sell, and discover extraordinary digital art and collectibles
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/create">
                <Button variant="primary" size="lg">
                  Create Your First NFT
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button variant="secondary" size="lg">
                  Explore Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
