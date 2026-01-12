import { useEffect, useState } from "react";
import { fetchListings, buyNFT } from "../utils/marketplace";
import { ethers } from "ethers";
import { fetchMetadata } from "../utils/metadata";
import { getCurrentAccount } from "../utils/wallet";
import { cancelListing } from "../utils/marketplace";
import { getContracts } from "../utils/contracts";
import NFT from "../../../blockchain/artifacts/contracts/NFT.sol/NFT.json";




export default function Marketplace() {
  const [items, setItems] = useState([]);
  const [account, setAccount] = useState("");

const load = async () => {
  const data = await fetchListings();
  setAccount(await getCurrentAccount());

  const provider = new ethers.BrowserProvider(window.ethereum);

  const enriched = await Promise.all(
    data.map(async (item) => {
      try {
        const nftContract = new ethers.Contract(
          item.nft,
          NFT.abi,
          provider
        );

        const tokenURI = await nftContract.tokenURI(item.tokenId);
        console.log("tokenURI from chain:", tokenURI);
        const metadata = await fetchMetadata(tokenURI);
        return {
          ...item,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image.startsWith("ipfs://")
            ? metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/")
            : metadata.image,
        };
      } catch (err) {
        console.error("Metadata load failed:", err);
        return item;
      }
    })
  );
  


  setItems(enriched);
};




  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h2>Marketplace</h2>

      {items.map((item, i) => {
        const isSeller =
          item.seller.toLowerCase() === account.toLowerCase();

        return (
          <div key={i} style={{ border: "1px solid #ccc", padding: 16, margin: 16 }}>
            <img
              src={item.image}
              alt={item.name}
              style={{ width: 200 }}
            />

            <h3>{item.name}</h3>
            <p>{item.description}</p>

            <p>Price: {ethers.formatEther(item.price)} ETH</p>

            {!isSeller && (
              <button
                onClick={async () => {
                  await buyNFT(i, item.price);
                  await load();
                }}
              >
                Buy
              </button>
            )}
            {isSeller && !item.sold && (
              <button
                onClick={async () => {
                  await cancelListing(i);
                  await load();
                }}
              >
                Cancel Listing
              </button>
            )}


            {isSeller && <p>🧑‍💼 Your listing</p>}
          </div>
        );
      })}
    </div>
  );
}
