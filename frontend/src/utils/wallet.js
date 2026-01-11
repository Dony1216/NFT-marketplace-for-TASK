export async function connectWallet() {
  if (!window.ethereum) {
    alert("MetaMask is not installed");
    return null;
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    return accounts[0];
  } catch (err) {
    console.error("Wallet connection failed:", err);
    return null;
  }
}

export async function getCurrentAccount() {
  if (!window.ethereum) return null;

  const accounts = await window.ethereum.request({
    method: "eth_accounts",
  });

  return accounts.length > 0 ? accounts[0] : null;
}
