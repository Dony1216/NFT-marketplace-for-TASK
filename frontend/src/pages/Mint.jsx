import { useState } from "react";
import { getContracts } from "../utils/contracts";
import { approveNFT, listNFT } from "../utils/marketplace";

export default function Mint() {
  const [uri, setUri] = useState("");

  async function mintNFT() {
    console.log("Mint clicked");
    console.log(uri);

  try {
    const { nft } = await getContracts();
    const tx = await nft.mint(uri);
    await tx.wait();
    alert("NFT Minted!");
  } catch (err) {
    console.error("Mint error:", err);
    alert(err?.reason || err?.message || "Mint failed");
  }
}

  return (
    <div>
      <h2>Mint NFT</h2>
      <input
        placeholder="IPFS Metadata URL"
        onChange={(e) => setUri(e.target.value)}
      />
      <button onClick={mintNFT}>Mint</button>

      <button onClick={() => approveNFT(1)}>
        Approve
      </button>

    </div>
  );
}