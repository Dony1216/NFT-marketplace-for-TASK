import { useEffect, useState } from "react";
import { fetchListings, buyNFT } from "../utils/marketplace";
import { ethers } from "ethers";
import { getCurrentAccount } from "../utils/wallet";
import { cancelListing } from "../utils/marketplace";


export default function Marketplace() {
  const [items, setItems] = useState([]);
  const [account, setAccount] = useState("");

  const load = async () => {
    const data = await fetchListings();
    setItems(data);
    setAccount(await getCurrentAccount());
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
          <div key={i}>
            <p>NFT: {item.nft}</p>
            <p>Token ID: {item.tokenId.toString()}</p>
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
