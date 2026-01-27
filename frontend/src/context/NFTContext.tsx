import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

/* ---------- Types ---------- */

export interface Creator {
  name: string;
  avatar: string;
  verified: boolean;
  address?: string;
}

export interface NFT {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  blockchain: "ethereum" | "polygon" | "solana";
  likes: number;
  creator: Creator;
  auctionEndTime?: number;
  highestBid?: number;
}

/* ---------- Context ---------- */

interface NFTContextProps {
  nfts: NFT[];
  addNFT: (nft: NFT) => void;
}

const NFTContext = createContext<NFTContextProps | undefined>(undefined);

/* ---------- Provider ---------- */

const STORAGE_KEY = "persisted_nfts";

export const NFTProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [nfts, setNFTs] = useState<NFT[]>([]);

  /* 🔁 Load from localStorage on app start */
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setNFTs(JSON.parse(stored));
      } catch (err) {
        console.error("Failed to parse stored NFTs", err);
      }
    }
  }, []);

  /* 💾 Save to localStorage whenever NFTs change */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nfts));
  }, [nfts]);

  const addNFT = (nft: NFT) => {
    setNFTs((prev) => [nft, ...prev]);
  };

  return (
    <NFTContext.Provider value={{ nfts, addNFT }}>
      {children}
    </NFTContext.Provider>
  );
};

/* ---------- Hook ---------- */

export const useNFTs = () => {
  const context = useContext(NFTContext);
  if (!context) {
    throw new Error("useNFTs must be used inside NFTProvider");
  }
  return context;
};
