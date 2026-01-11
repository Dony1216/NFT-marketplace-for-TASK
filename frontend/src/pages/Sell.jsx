import { useState } from "react";
import { listNFT } from "../utils/marketplace";

export default function Sell() {
  const [tokenId, setTokenId] = useState("");
  const [price, setPrice] = useState("");

  async function handleSell() {
    await listNFT(tokenId, price);
    alert("NFT listed!");
  }

  return (
    <div>
      <h2>Sell NFT</h2>
      <input
        placeholder="Token ID"
        onChange={(e) => setTokenId(e.target.value)}
      />
      <input
        placeholder="Price (ETH)"
        onChange={(e) => setPrice(e.target.value)}
      />
      <button onClick={handleSell}>List NFT</button>
    </div>
  );
}
