import { ethers } from "ethers";
import { getContracts, NFT_ADDRESS, MARKET_ADDRESS } from "./contracts";
import Marketplace from "../../../blockchain/artifacts/contracts/Marketplace.sol/Marketplace.json";


export async function fetchListings() {
  const { market } = await getContracts();
  return await market.getAllListings();
}

export async function listNFT(tokenId, priceETH) {
  // ✅ signer must be destructured FIRST
  const { nft, market, signer } = await getContracts();

  const user = await signer.getAddress();

  const approved = await nft.isApprovedForAll(user, market.target);
  if (!approved) {
    const txApprove = await nft.setApprovalForAll(market.target, true);
    await txApprove.wait();
  }

  const price = ethers.parseEther(priceETH);
  const tx = await market.listItem(NFT_ADDRESS, tokenId, price);
  await tx.wait();
}
export async function buyNFT(index, price) {
  const { market } = await getContracts();

  const tx = await market.buyItem(index, {
    value: price, // ✅ already wei
  });

  await tx.wait();
}

export async function approveNFT() {
  const { nft, market } = await getContracts();

  const tx = await nft.setApprovalForAll(market.target, true);
  await tx.wait();
}

export async function updatePrice(nft, tokenId, newPrice) {
  const { market } = await getContracts();
  const tx = await market.updatePrice(
    nft,
    tokenId,
    ethers.parseEther(newPrice)
  );
  await tx.wait();
}

export async function cancelListing(itemId) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const marketplace = new ethers.Contract(
    MARKET_ADDRESS,
    Marketplace.abi,
    signer
  );

  const tx = await marketplace.cancelListing(itemId);
  await tx.wait();
}
