// ==================== CONTRACT ADDRESSES ====================
export const NFT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const MARKETPLACE_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

// ==================== NFT ABI ====================
export const NFT_ABI = [
  // ===== ERC721 CORE =====
  "function tokenCount() view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function approve(address to, uint256 tokenId)",
  "function supportsInterface(bytes4 interfaceId) view returns (bool)",

  // ===== MINTING =====
  "function mint(string _uri) payable returns (uint256)",

  // ===== ANTI-SPAM / COOLDOWN =====
  "function mintFee() view returns (uint256)",
  "function mintCooldown() view returns (uint256)",
  "function lastMintTime(address user) view returns (uint256)",
  "function canMint(address user) view returns (bool)",

  // ===== ROYALTIES (ERC-2981) =====
  "function royaltyInfo(uint256 tokenId, uint256 salePrice) view returns (address receiver, uint256 royaltyAmount)",

  // ===== ADMIN =====
  "function withdraw()",
  "function setDefaultRoyalty(address receiver, uint96 feeNumerator)",
  "function setTokenRoyalty(uint256 tokenId, address receiver, uint96 feeNumerator)"
];

// ==================== MARKETPLACE ABI ====================
export const MARKETPLACE_ABI = [
  // ===== FIXED PRICE =====
  "function listItem(address nft, uint256 tokenId, uint256 price)",
  "function buyItem(uint256 listingId) payable",
  "function cancelListing(uint256 listingId)",
  "function updatePrice(uint256 listingId, uint256 newPrice)",

  // ===== VIEWS =====
  "function getAllListings() view returns(tuple(address seller,uint256 price,address nft,uint256 tokenId)[])",
  "function getSales() view returns(tuple(address seller,address buyer,address nft,uint256 tokenId,uint256 price,uint256 timestamp)[])",
  "function isSold(address nft,uint256 tokenId) view returns(bool)",
  "function listingIndex(address nft,uint256 tokenId) view returns(uint256)",

  // ===== AUCTIONS =====
  "function createAuction(address nft,uint256 tokenId,uint256 startPrice,uint256 duration)",
  "function bid(uint256 auctionId) payable",
  "function endAuction(uint256 auctionId)",
  "function getAuction(uint256 auctionId) view returns(tuple(address seller,address nft,uint256 tokenId,uint256 startPrice,uint256 highestBid,address highestBidder,uint256 endTime,bool ended))",
  "function auctionCount() view returns (uint256)"
];
