import React, { useEffect, useState } from "react";
import { NFTCard } from "../components/organisms/NFTCard";
import { getNFTContract } from "../../web3";
import { Package, Award, Gavel } from "lucide-react";

interface NFT {
  id: string;
  name?: string;
  description?: string;
  image?: string;
  owner: string;
  creator: string;
  category?: string;
}

export const MyNFTsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"owned" | "created" | "onAuction">("owned");
  const [ownedNFTs, setOwnedNFTs] = useState<NFT[]>([]);
  const [createdNFTs, setCreatedNFTs] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: "owned" as const, label: "Owned", icon: Package, count: ownedNFTs.length },
    { id: "created" as const, label: "Created", icon: Award, count: createdNFTs.length },
    { id: "onAuction" as const, label: "On Auction", icon: Gavel, count: 0 },
  ];

  const fetchNFTs = async () => {
    if (!window.ethereum) return;
    setLoading(true);

    try {
      const [account] = await window.ethereum.request({ method: "eth_requestAccounts" });
      const nftContract = await getNFTContract();
      const totalSupply = Number(await nftContract.tokenCount());
      const owned: NFT[] = [];
      const created: NFT[] = [];
      console.log(totalSupply)
      for (let i = 1; i <= totalSupply; i++) {
        try {
          const owner = await nftContract.ownerOf(i);
          const tokenURI = await nftContract.tokenURI(i);

          const res = await fetch(tokenURI);
          const metadata = await res.json();

          const nftData: NFT = {
            id: i.toString(),
            owner,
            name: metadata.name,
            description: metadata.description,
            image: metadata.image,
            creator: metadata.creator,
            category: metadata.category,
          };
      console.log(nftData)
      
          if (owner.toLowerCase() === account.toLowerCase()) owned.push(nftData);
          if (metadata.creator?.toLowerCase() === account.toLowerCase()) created.push(nftData);
        } catch (err) {
          console.warn(`Failed to fetch NFT #${i}`, err);
        }
      }

      setOwnedNFTs(owned);
      setCreatedNFTs(created);
    } catch (err) {
      console.error("Failed to fetch NFTs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, []);

  const getCurrentNFTs = () => {
    switch (activeTab) {
      case "owned":
        return ownedNFTs;
      case "created":
        return createdNFTs;
      case "onAuction":
        return [];
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            My NFTs
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your digital assets and track your collection
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-2 border-b border-purple-500/20">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 transition-all duration-200 ${
                activeTab === tab.id
                  ? "border-b-2 border-purple-500 text-purple-400"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? "bg-purple-500/20 text-purple-300" : "bg-white/5 text-muted-foreground"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* NFT Grid */}
        {loading ? (
          <p className="text-center text-muted-foreground mt-10">Loading NFTs...</p>
        ) : getCurrentNFTs().length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getCurrentNFTs().map((nft) => (
              <NFTCard key={nft.id} nft={nft} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Package className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No NFTs Found</h3>
            <p className="text-muted-foreground mb-6">
              {activeTab === "owned" && "You don't own any NFTs yet."}
              {activeTab === "created" && "You haven't created any NFTs yet."}
              {activeTab === "onAuction" && "You don't have any NFTs on auction."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
