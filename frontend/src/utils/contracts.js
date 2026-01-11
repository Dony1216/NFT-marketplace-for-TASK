import { ethers } from "ethers";
import NFT from "../../../blockchain/artifacts/contracts/NFT.sol/NFT.json";
import Marketplace from "../../../blockchain/artifacts/contracts/Marketplace.sol/Marketplace.json";

export const NFT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const MARKET_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

export async function getContracts() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const nft = new ethers.Contract(NFT_ADDRESS, NFT.abi, signer);
  const market = new ethers.Contract(MARKET_ADDRESS, Marketplace.abi, signer);

  return { nft, market, signer };
}