import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "../../components/atoms/Badge";

interface NFTCardProps {
  nft: {
    id: string;
    name?: string;
    title?: string;
    description?: string;
    image?: string;
    owner?: string;
    category?: string;
  };
}

export const NFTCard: React.FC<NFTCardProps> = ({ nft }) => {
  // ---------- SAFE FALLBACKS ----------
  const name = nft.name || nft.title || `NFT #${nft.id}`;
  const description = nft.description || "No description";
  const image = nft.image || "/placeholder.png";
  const category = nft.category || "Art";

  const ownerAddress = nft.owner;
  const shortOwner = ownerAddress
    ? `${ownerAddress.slice(0, 6)}...${ownerAddress.slice(-4)}`
    : "Unknown";

  return (
    <Link to={`/nft/${nft.id}`}>
      <div className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] cursor-pointer">
        <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-purple-500/20 rounded-2xl overflow-hidden hover:border-purple-500/40 hover:shadow-[0_8px_32px_rgba(139,92,246,0.25)] transition-all duration-300">
          
          {/* NFT Image */}
          <div className="relative aspect-square overflow-hidden">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <Badge variant="purple">{category}</Badge>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-foreground mb-2 truncate">
              {name}
            </h3>

            <p className="text-sm text-muted-foreground truncate">
              {description}
            </p>

            <div className="mt-2 text-xs text-muted-foreground truncate">
              Owner: {shortOwner}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
