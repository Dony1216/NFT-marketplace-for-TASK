import { useEffect, useState } from "react";
import { connectWallet } from "../utils/wallet";
import { Link } from "react-router-dom";

export default function Header() {
  const [account, setAccount] = useState(null);

  // auto-detect connected wallet
  useEffect(() => {
    async function loadAccount() {
      if (!window.ethereum) return;

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    }

    loadAccount();
  }, []);

  async function handleConnect() {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
  }

  return (
    <div style={{ padding: 10, borderBottom: "1px solid #ccc" }}>
      <Link to="/">Home</Link>{" "}
      <Link to="/mint">Mint</Link>{" "}
      <Link to="/sell">Sell</Link>{" "}
      <Link to="/marketplace">Marketplace</Link>

      <span style={{ float: "right" }}>
        {account ? (
          <strong>
            Connected:
            {account.slice(0, 6)}...{account.slice(-4)}
          </strong>
        ) : (
          <button onClick={handleConnect}>Connect Wallet</button>
        )}
      </span>
    </div>
  );
}
