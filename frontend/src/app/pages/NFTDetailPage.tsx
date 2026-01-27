import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useNFTs } from "../../context/NFTContext";
import { Button } from "../components/atoms/Button";
import { Badge } from "../components/atoms/Badge";
import { formatPrice, formatTimeRemaining } from "../utils/formatters";
import {
  Heart,
  Clock,
  TrendingUp,
  History,
  FileText,
  Tag,
  ShoppingCart,
  Gavel,
  Share2,
  MoreHorizontal,
} from "lucide-react";

export const NFTDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { nfts } = useNFTs();

  const nft = nfts.find((n) => String(n.id) === id);

  const [activeTab, setActiveTab] = useState<
    "details" | "properties" | "history" | "offers"
  >("details");
  const [bidAmount, setBidAmount] = useState("");
  const [isLiked, setIsLiked] = useState(false);

  // ================= NOT FOUND =================
  if (!nft) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">NFT Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The NFT you're looking for doesn't exist.
          </p>
          <Link to="/marketplace">
            <Button variant="primary">Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  const blockchain = nft.blockchain ?? "ethereum";

  const blockchainColors: Record<string, any> = {
    ethereum: "purple",
    polygon: "cyan",
    solana: "success",
  };

  const tabs = [
    { id: "details", label: "Details", icon: FileText },
    { id: "properties", label: "Properties", icon: Tag },
    { id: "history", label: "History", icon: History },
    { id: "offers", label: "Offers", icon: TrendingUp },
  ] as const;

  // ================= RENDER =================
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* LEFT */}
          <div className="space-y-6">
            <div className="relative rounded-2xl overflow-hidden bg-white/5 border border-purple-500/20">
              <img
                src={nft.image}
                alt={nft.title}
                className="w-full aspect-square object-cover"
              />

              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="w-12 h-12 rounded-full bg-black/60 border border-white/10 flex items-center justify-center"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      isLiked
                        ? "fill-red-500 text-red-500"
                        : "text-white"
                    }`}
                  />
                </button>
                <button className="w-12 h-12 rounded-full bg-black/60 border border-white/10 flex items-center justify-center">
                  <Share2 className="w-6 h-6 text-white" />
                </button>
                <button className="w-12 h-12 rounded-full bg-black/60 border border-white/10 flex items-center justify-center">
                  <MoreHorizontal className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-purple-500/20">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                Description
              </h3>
              <p className="text-muted-foreground">
                {nft.description || "No description provided."}
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <div>
              <div className="flex gap-3 mb-4">
                <Badge variant={blockchainColors[blockchain]}>
                  {blockchain.charAt(0).toUpperCase() +
                    blockchain.slice(1)}
                </Badge>
                {nft.category && (
                  <Badge variant="default">{nft.category}</Badge>
                )}
              </div>

              <h1 className="text-5xl font-bold mb-4">{nft.title}</h1>

              <div className="flex items-center gap-3">
                <img
                  src={nft.creator.avatar}
                  alt={nft.creator.name}
                  className="w-12 h-12 rounded-full border"
                />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Created by
                  </p>
                  <p className="font-semibold">
                    {nft.creator.name}
                  </p>
                </div>
              </div>
            </div>

            {nft.auctionEndTime && (
              <div className="p-6 rounded-2xl bg-purple-500/10 border border-purple-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-6 h-6 text-purple-400" />
                  <p className="text-lg font-semibold">
                    Auction ends in
                  </p>
                </div>
                <p className="text-4xl font-bold">
                  {formatTimeRemaining(nft.auctionEndTime)}
                </p>
              </div>
            )}

            <div className="p-6 rounded-2xl bg-white/5 border border-purple-500/20">
              <p className="text-sm text-muted-foreground mb-2">
                {nft.auctionEndTime ? "Current Bid" : "Price"}
              </p>

              <p className="text-4xl font-bold mb-4">
                {formatPrice(nft.highestBid ?? nft.price)} ETH
              </p>

              {nft.auctionEndTime ? (
                <>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter bid"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border mb-3"
                  />
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
            </div>

            {/* TABS */}
            <div>
              <div className="flex gap-2 mb-6 border-b border-purple-500/20">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 ${
                      activeTab === tab.id
                        ? "border-b-2 border-purple-500 text-purple-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-purple-500/20">
                {activeTab === "details" && (
                  <>
                    <p>Token ID: {nft.id}</p>
                    <p>Standard: ERC-721</p>
                    <p>Blockchain: {blockchain}</p>
                  </>
                )}

                {activeTab === "properties" && (
                  <p className="text-muted-foreground">
                    No properties available
                  </p>
                )}

                {activeTab === "history" && (
                  <p className="text-muted-foreground">
                    Minted by {nft.creator.name}
                  </p>
                )}

                {activeTab === "offers" && (
                  <p className="text-muted-foreground">
                    No offers yet
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
