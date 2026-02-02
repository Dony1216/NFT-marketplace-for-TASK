import React from "react";
import { useState } from "react";
import { Modal } from "../molecules/Modal"; // adjust path
import { Link, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { formatAddress } from "../../utils/formatters";
import { ShoppingCart, Tag, Gavel, ExternalLink } from "lucide-react";
import { Button } from "../atoms/Button";
import { Badge } from "../atoms/Badge";
import { ListNFTForm } from "../molecules/ListNFTForm";

interface NFTCardProps {
  nft: {
    id: string;
    name: string;
    description: string;
    image: string;
    price: number;
    creator: string;
    isListed?: boolean;
    owner: string;
    category: string;
    likes: number;
  };
}

export const NFTCard: React.FC<NFTCardProps> = ({ nft }) => {
  const { address } = useAccount();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState<null | "buy" | "list" | "auction">(null);

  const isOwner = address?.toLowerCase() === nft.owner?.toLowerCase();
  const isCreator = address?.toLowerCase() === nft.creator?.toLowerCase()
  const handleAction = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(path);
  };
  return (
    <>
      <Link to={`/nft/${nft.id}`} className="group relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>

        <div className="relative bg-[#0D0B14] border border-white/10 rounded-2xl overflow-hidden hover:translate-y-[-4px] transition-all duration-300">
          {/* Image Section */}
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

          {/* Content Section */}
          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                  {nft.id}.{nft.name}
                </h3>
                <div className="flex md:flex-row gap-6 space-between justify-between">
                  {nft.price == 0 ? (
                    <h4 className="font-bold text-white mb-1 group-hover:text-purple-400 transition-colors"> Price: No Set</h4>
                  ) : (
                    <h4 className="font-bold text-white mb-1 group-hover:text-purple-400 transition-colors"> Price: {nft.price} ETH</h4>
                  )}
                  {isCreator ? (
                    <h4 className="text-gray-400 mb-0">Creator: You</h4>
                  ) : (
                    <p className="text-sm text-gray-400">Creator: {formatAddress(nft.creator)} </p>
                  )}
                </div>

              </div>
              <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              {!isOwner ? (
                // Buyer Actions
                <Button
                  variant="primary"
                  className="w-full gap-2 text-sm py-2"

                >
                  <ShoppingCart className="w-4 h-4" />
                  Buy Now
                </Button>
              ) : (
                // Owner Actions
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="w-full gap-2 text-xs py-2 border-purple-500/30 hover:bg-purple-500/10"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setOpenModal("list");
                    }}
                  >
                    <Tag className="w-3 h-3" />
                    List
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2 text-xs py-2 border-cyan-500/30 hover:bg-cyan-500/10"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setOpenModal("auction");
                    }}
                  >
                    <Gavel className="w-3 h-3" />
                    Auction
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>

      <Modal isOpen={!!openModal} onClose={() => setOpenModal(null)}>

        <div className="animate-fadeIn">
          {openModal === "list" && (
            <ListNFTForm
              onSubmit={(price) => {
                console.log("Listing price:", price);
                // next step: trigger Web3 tx
                setOpenModal(null);
              }}
            />
          )}
          {openModal === "auction" && (
            <>
              <h3 className="text-lg font-bold text-white mb-4">Start Auction</h3>
              <Button className="w-full">Create Auction</Button>
            </>
          )}
        </div>

      </Modal>
    </>


  );
};