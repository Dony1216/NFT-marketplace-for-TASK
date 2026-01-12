// utils/metadata.js
export async function fetchMetadata(tokenURI) {
  let url = tokenURI;

  // 🔑 convert ipfs://CID → https://ipfs.io/ipfs/CID
  if (tokenURI.startsWith("ipfs://")) {
    url = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
  }

  const res = await fetch(url);

  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    throw new Error("TokenURI returned HTML, not JSON");
  }

  return await res.json();
}
