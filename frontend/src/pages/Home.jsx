import { connectWallet } from "../utils/wallet";
import { useState } from "react";

export default function Home() {
  const [account, setAccount] = useState("");

  async function handleConnect() {
    const signer = await connectWallet();
    if (signer) {
      const address = await signer.getAddress();
      setAccount(address);
    }
  }

  return (
    <div>
      <h1>NFT Marketplace</h1>

      <button onClick={handleConnect}>
        Connect Wallet
      </button>

      {account && (
        <p>Connected: {account}</p>
      )}

      <br />
      <a href="/mint">Mint NFT</a>
      {/* <a href="/marketplace">MarketPlace</a>       */}
    </div>
  );
}