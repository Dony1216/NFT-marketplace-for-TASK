import React, { useState } from 'react';
import { Heart, Clock, TrendingUp } from 'lucide-react';
import { Badge } from '@/app/components/atoms/Badge';
import { NFT } from '@/app/utils/mockData';
import { formatPrice, formatTimeRemaining } from '@/app/utils/formatters';
import { Link } from 'react-router-dom';

interface NFTCardProps {
  nft: NFT;
  onLike?: (id: string) => void;
}

export const NFTCard: React.FC<NFTCardProps> = ({ nft, onLike }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(nft.likes);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    onLike?.(nft.id);
  };

  const blockchainColors = {
    ethereum: 'purple',
    polygon: 'cyan',
    solana: 'success'
  } as const;

  return (
    <Link to={`/nft/${nft.id}`}>
      <div className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] cursor-pointer">
        {/* Glassmorphism Card */}
        <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-purple-500/20 rounded-2xl overflow-hidden hover:border-purple-500/40 hover:shadow-[0_8px_32px_rgba(139,92,246,0.25)] transition-all duration-300">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden">
            <img 
              src={nft.image} 
              alt={nft.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Blockchain Badge */}
            <div className="absolute top-3 left-3">
              <Badge variant={blockchainColors[nft.blockchain]}>
                {nft.blockchain.charAt(0).toUpperCase() + nft.blockchain.slice(1)}
              </Badge>
            </div>

            {/* Like Button */}
            <button
              onClick={handleLike}
              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-black/60 hover:scale-110"
            >
              <Heart 
                className={`w-5 h-5 transition-all duration-300 ${
                  isLiked 
                    ? 'fill-red-500 text-red-500' 
                    : 'text-white'
                }`}
              />
            </button>

            {/* Auction Timer - Only show if auction */}
            {nft.auctionEndTime && (
              <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-purple-500/30 flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-white font-medium">
                  {formatTimeRemaining(nft.auctionEndTime)}
                </span>
              </div>
            )}
          </div>

          {/* Card Content */}
          <div className="p-4">
            {/* Title */}
            <h3 className="text-lg font-semibold text-foreground mb-2 truncate group-hover:text-purple-400 transition-colors">
              {nft.title}
            </h3>

            {/* Creator */}
            <div className="flex items-center gap-2 mb-4">
              <img 
                src={nft.creator.avatar} 
                alt={nft.creator.name}
                className="w-6 h-6 rounded-full border border-purple-500/30"
              />
              <span className="text-sm text-muted-foreground">
                {nft.creator.name}
              </span>
              {nft.creator.verified && (
                <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>

            {/* Price & Bid Info */}
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  {nft.auctionEndTime ? 'Current Bid' : 'Price'}
                </p>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/>
                  </svg>
                  <span className="text-xl font-bold text-foreground">
                    {formatPrice(nft.highestBid || nft.price)}
                  </span>
                  <span className="text-sm text-muted-foreground">ETH</span>
                </div>
                {nft.highestBid && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Floor: {formatPrice(nft.price)} ETH
                  </p>
                )}
              </div>

              {/* Likes */}
              <div className="flex items-center gap-1 text-muted-foreground">
                <Heart className="w-4 h-4" />
                <span className="text-sm">{likes}</span>
              </div>
            </div>
          </div>

          {/* Hover Glow Effect */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-blue-500/10" />
          </div>
        </div>
      </div>
    </Link>
  );
};
