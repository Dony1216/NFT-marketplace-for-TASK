import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockNFTs } from '@/app/utils/mockData';
import { Button } from '@/app/components/atoms/Button';
import { Badge } from '@/app/components/atoms/Badge';
import { formatPrice, formatTimeRemaining } from '@/app/utils/formatters';
import { Heart, Clock, TrendingUp, History, FileText, Tag, ShoppingCart, Gavel, Share2, MoreHorizontal } from 'lucide-react';

export const NFTDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const nft = mockNFTs.find(n => n.id === id);
  
  const [activeTab, setActiveTab] = useState<'details' | 'properties' | 'history' | 'offers'>('details');
  const [bidAmount, setBidAmount] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  if (!nft) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">NFT Not Found</h2>
          <p className="text-muted-foreground mb-6">The NFT you're looking for doesn't exist.</p>
          <Link to="/marketplace">
            <Button variant="primary">Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  const blockchainColors = {
    ethereum: 'purple',
    polygon: 'cyan',
    solana: 'success'
  } as const;

  const tabs = [
    { id: 'details' as const, label: 'Details', icon: FileText },
    { id: 'properties' as const, label: 'Properties', icon: Tag },
    { id: 'history' as const, label: 'History', icon: History },
    { id: 'offers' as const, label: 'Offers', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Image */}
          <div className="space-y-6">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-purple-500/20">
              <img 
                src={nft.image} 
                alt={nft.title}
                className="w-full aspect-square object-cover"
              />
              
              {/* Action Buttons Overlay */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/80 transition-all duration-300"
                >
                  <Heart 
                    className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`}
                  />
                </button>
                <button className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/80 transition-all duration-300">
                  <Share2 className="w-6 h-6 text-white" />
                </button>
                <button className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/80 transition-all duration-300">
                  <MoreHorizontal className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-purple-500/20">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                Description
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {nft.description || 'No description available for this NFT.'}
              </p>
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant={blockchainColors[nft.blockchain]}>
                  {nft.blockchain.charAt(0).toUpperCase() + nft.blockchain.slice(1)}
                </Badge>
                <Badge variant="default">{nft.category}</Badge>
              </div>

              <h1 className="text-5xl font-bold mb-4">{nft.title}</h1>

              {/* Creator */}
              <div className="flex items-center gap-3">
                <img 
                  src={nft.creator.avatar} 
                  alt={nft.creator.name}
                  className="w-12 h-12 rounded-full border-2 border-purple-500/30"
                />
                <div>
                  <p className="text-sm text-muted-foreground">Created by</p>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{nft.creator.name}</p>
                    {nft.creator.verified && (
                      <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Auction Timer */}
            {nft.auctionEndTime && (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-6 h-6 text-purple-400" />
                  <p className="text-lg font-semibold">Auction ends in</p>
                </div>
                <p className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  {formatTimeRemaining(nft.auctionEndTime)}
                </p>
              </div>
            )}

            {/* Price Info */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-purple-500/20">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {nft.auctionEndTime ? 'Current Bid' : 'Price'}
                  </p>
                  <div className="flex items-center gap-2">
                    <svg className="w-8 h-8 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/>
                    </svg>
                    <span className="text-4xl font-bold">
                      {formatPrice(nft.highestBid || nft.price)}
                    </span>
                    <span className="text-xl text-muted-foreground">ETH</span>
                  </div>
                  {nft.highestBid && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Floor price: {formatPrice(nft.price)} ETH
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Likes</p>
                  <p className="text-2xl font-bold flex items-center gap-1">
                    <Heart className="w-5 h-5 text-red-400" />
                    {nft.likes}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {nft.auctionEndTime ? (
                  <>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder="Enter bid amount"
                        className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-purple-500/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                      />
                      <span className="flex items-center px-4 text-muted-foreground">ETH</span>
                    </div>
                    <Button variant="primary" className="w-full">
                      <Gavel className="w-5 h-5" />
                      Place Bid
                    </Button>
                  </>
                ) : (
                  <Button variant="primary" className="w-full">
                    <ShoppingCart className="w-5 h-5" />
                    Buy Now
                  </Button>
                )}
                <Button variant="outline" className="w-full">
                  Make Offer
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div>
              <div className="flex gap-2 mb-6 border-b border-purple-500/20">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'border-b-2 border-purple-500 text-purple-400'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-purple-500/20 min-h-[200px]">
                {activeTab === 'details' && (
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-purple-500/10">
                      <span className="text-muted-foreground">Contract Address</span>
                      <span className="font-mono text-sm">0x742d...92c3</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-purple-500/10">
                      <span className="text-muted-foreground">Token ID</span>
                      <span className="font-mono text-sm">{nft.id}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-purple-500/10">
                      <span className="text-muted-foreground">Token Standard</span>
                      <span>ERC-721</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground">Blockchain</span>
                      <span className="capitalize">{nft.blockchain}</span>
                    </div>
                  </div>
                )}

                {activeTab === 'properties' && (
                  <div className="grid grid-cols-2 gap-4">
                    {nft.properties && nft.properties.length > 0 ? (
                      nft.properties.map((prop, index) => (
                        <div 
                          key={index}
                          className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20"
                        >
                          <p className="text-xs text-purple-400 mb-1">{prop.trait}</p>
                          <p className="font-semibold">{prop.value}</p>
                        </div>
                      ))
                    ) : (
                      <p className="col-span-2 text-muted-foreground text-center py-8">
                        No properties available
                      </p>
                    )}
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-white/5">
                      <TrendingUp className="w-5 h-5 text-green-400 mt-1" />
                      <div className="flex-1">
                        <p className="font-semibold">Minted</p>
                        <p className="text-sm text-muted-foreground">by {nft.creator.name}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">2 days ago</p>
                    </div>
                    {nft.highestBid && (
                      <div className="flex items-start gap-4 p-4 rounded-lg bg-white/5">
                        <Gavel className="w-5 h-5 text-cyan-400 mt-1" />
                        <div className="flex-1">
                          <p className="font-semibold">Bid placed</p>
                          <p className="text-sm text-muted-foreground">{formatPrice(nft.highestBid)} ETH</p>
                        </div>
                        <p className="text-sm text-muted-foreground">1 day ago</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'offers' && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Tag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No offers yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
