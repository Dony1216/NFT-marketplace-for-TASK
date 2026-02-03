import React, { useState, useEffect } from "react";
import { Modal } from "../molecules/Modal";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { formatAddress } from "../../utils/formatters";
import { ShoppingCart, Tag, Gavel, ExternalLink } from "lucide-react";
import { Button } from "../atoms/Button";
import { ListNFTForm } from "../molecules/ListNFTForm";
import { getMarketplaceContract } from "../../../web3";
import { ethers } from "ethers";
import { NFT_ADDRESS } from "../../../constants";
import { Badge } from "lucide-react";

interface NFTCardProps {
  nft: {
    id: string;
    name: string;
    description: string;
    image: string;
    price: number;
    creator: string;
    owner: string;
    category: string;
    likes: number;

    // Auction fields
    auctionEndTime?: number; // timestamp in seconds
    highestBid?: number;
    highestBidder?: string;

    // Functions
    setPrice?: (id: string, val: string) => void;
    listNFT?: (tokenId: string) => Promise<void>;
    createAuction?: (
      tokenId: string,
      startPrice: string,
      durationHours: number
    ) => Promise<void>;
  };
  reload?: () => void;
  mode?: "wallet" | "marketplace" | "auction";
}

export const NFTCard: React.FC<NFTCardProps> = ({ nft, reload, mode }) => {
  const { address } = useAccount();
  const [openModal, setOpenModal] = useState<null | "buy" | "list" | "auction" | "bid">(null);
  const [auctionPrice, setAuctionPrice] = useState("");
  const [auctionDuration, setAuctionDuration] = useState("");
  const [bidAmount, setBidAmount] = useState("");

  const isOwner = address?.toLowerCase() === nft.owner?.toLowerCase();
  const isCreator = address?.toLowerCase() === nft.creator?.toLowerCase();
  const isOnAuction = !!nft.auctionEndTime;
  console.log(nft.owner)
console.log(isOwner)
  const [timeLeft, setTimeLeft] = useState("");

  // Countdown timer for auctions
  useEffect(() => {
    if (!isOnAuction) return;

    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = (nft.auctionEndTime || 0) - now;
      if (remaining <= 0) {
        setTimeLeft("Ended");
      } else {
        const hours = Math.floor(remaining / 3600);
        const minutes = Math.floor((remaining % 3600) / 60);
        const seconds = remaining % 60;
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [nft.auctionEndTime, isOnAuction]);

  const placeBid = async () => {
    if (!bidAmount || Number(bidAmount) <= 0) return alert("Enter valid bid");

    try {
      const marketplace = await getMarketplaceContract(true);
      const listingId = await marketplace.listingIndex(NFT_ADDRESS, Number(nft.id));

      const tx = await marketplace.bid(listingId, {
        value: ethers.parseEther(bidAmount),
      });
      await tx.wait();
      alert("Bid placed!");
      setOpenModal(null);
      reload?.();
    } catch (err: any) {
      console.error(err);
      alert("Bid failed: " + err.message);
    }
  };

  return (
    <>
      <div className="group relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
        <div className="relative bg-[#0D0B14] border border-white/10 rounded-2xl overflow-hidden hover:translate-y-[-4px] transition-all duration-300">
          <div className="relative aspect-square overflow-hidden">
            <img
              src={nft.image}
              alt={nft.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {isOwner && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-black/60 backdrop-blur-md border-white/10 text-purple-600">
                  Owned
                </Badge>
              </div>
            )}
          </div>

          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                  {nft.id}.{nft.name}
                </h3>
                <div className="flex md:flex-row gap-6 justify-between">
                  <h4 className="font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                    {isOnAuction
                      ? `Highest Bid: ${nft.highestBid || nft.price} ETH`
                      : nft.price === 0
                      ? "Price: Not set"
                      : `Price: ${nft.price} ETH`}
                  </h4>
                  {isCreator ? (
                    <h4 className="text-gray-400 mb-0">Creator: You</h4>
                  ) : (
                    <p className="text-sm text-gray-400">
                      Creator: {formatAddress(nft.creator)}
                    </p>
                  )}
                </div>

                {isOnAuction && (
                  <div className="text-sm text-gray-300 mt-1">
                    Highest Bidder: {nft.highestBidder ? formatAddress(nft.highestBidder) : "None"}
                    <br />
                    Time Left: {timeLeft}
                  </div>
                )}
              </div>
              <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              {!isOwner && !isOnAuction && (
                <Button
                  variant="primary"
                  className="w-full gap-2 text-sm py-2"
                  onClick={async () => {
                    alert("Buy logic here (already implemented)");
                  }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Buy Now
                </Button>
              )}

              {isOwner && !isOnAuction && (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="w-full gap-2 text-xs py-2 border-purple-500/30 hover:bg-purple-500/10"
                    onClick={() => setOpenModal("list")}
                  >
                    <Tag className="w-3 h-3" />
                    List
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2 text-xs py-2 border-cyan-500/30 hover:bg-cyan-500/10"
                    onClick={() => setOpenModal("auction")}
                  >
                    <Gavel className="w-3 h-3" />
                    Auction
                  </Button>
                </div>
              )}

              {isOnAuction && !isOwner && (
                <Button
                  variant="primary"
                  className="w-full gap-2 text-sm py-2"
                  onClick={() => setOpenModal("bid")}
                >
                  Place Bid
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={!!openModal} onClose={() => setOpenModal(null)}>
        <div className="animate-fadeIn">
          {openModal === "list" && nft.listNFT && (
            <ListNFTForm
              onSubmit={async (priceValue) => {
                nft.setPrice?.(nft.id, priceValue.toString());
                await nft.listNFT(nft.id);
                setOpenModal(null);
                reload?.();
              }}
            />
          )}

          {openModal === "auction" && nft.createAuction && (
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold text-white mb-2">Start Auction</h3>
              <input
                type="number"
                placeholder="Start Price (ETH)"
                value={auctionPrice}
                onChange={(e) => setAuctionPrice(e.target.value)}
                className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              />
              <input
                type="number"
                placeholder="Duration (hours)"
                value={auctionDuration}
                onChange={(e) => setAuctionDuration(e.target.value)}
                className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              />
              <Button
                className="w-full"
                onClick={async () => {
                  if (!auctionPrice || !auctionDuration)
                    return alert("Enter price & duration");
                  await nft.createAuction(nft.id, auctionPrice, Number(auctionDuration));
                  setOpenModal(null);
                  reload?.();
                }}
              >
                Create Auction
              </Button>
            </div>
          )}

          {openModal === "bid" && (
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold text-white mb-2">Place Your Bid</h3>
              <input
                type="number"
                placeholder="Bid Amount (ETH)"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              />
              <Button className="w-full" onClick={placeBid}>
                Place Bid
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
