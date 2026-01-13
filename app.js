const buyBtn = document.getElementById("buyNFT");
let selectedNFT = null;

let provider;
let signer;
let contract;

const contractAddress = "PASTE_YOUR_CONTRACT_ADDRESS_HERE";
const contractABI = [
  // Paste your NFT contract ABI here
];

// Sample NFTs array
const sampleNFTs = [
  { name: "Baton Racket NFT", img: "img/baton_racket.png", price: "0.08" },
  { name: "Epic NFT #1", img: "img/nft1.png", price: "0.12" },
  { name: "Epic NFT #2", img: "img/nft2.png", price: "0.15" },
  { name: "Epic NFT #3", img: "img/nft3.png", price: "0.20" },
  { name: "Epic NFT #4", img: "img/nft4.png", price: "0.30" }
];

// Load NFTs dynamically
const nftList = document.getElementById("nftList");
const modal = document.getElementById("nftModal");
const modalImg = document.getElementById("modalImg");
const modalTitle = document.getElementById("modalTitle");

function loadNFTs() {
  nftList.innerHTML = "";

  sampleNFTs.forEach((nft) => {
    const card = document.createElement("div");
    card.className = "nft-card";

    card.innerHTML = `
      <img src="${nft.img}" />
      <p class="nft-name">${nft.name}</p>

      <div class="price-row">
        <img src="img/eth.png" class="eth-icon" />
        <span>${nft.price} ETH</span>
      </div>
    `;

    card.onclick = () => openModal(nft);
    nftList.appendChild(card);
  });
}

function openModal(nft) {
  selectedNFT = nft; // store selected NFT
  modal.style.display = "flex";
  modalImg.src = nft.img;
  modalTitle.innerText = nft.name;
  modalPrice.innerText = `${nft.price} ETH`;
}


document.getElementById("closeModal").onclick = () => {
  modal.style.display = "none";
};

window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

/* Scroll buttons */
document.getElementById("scrollLeft").onclick = () => {
  nftList.scrollBy({ left: -300, behavior: "smooth" });
};

document.getElementById("scrollRight").onclick = () => {
  nftList.scrollBy({ left: 300, behavior: "smooth" });
};


// Wallet connection
async function connectWallet() {
  if (window.ethereum) {
    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    document.getElementById("connectWallet").innerText = "Wallet Connected";
    console.log("Wallet connected:", await signer.getAddress());
  } else {
    alert("Install MetaMask!");
  }
}

// Mint NFT
async function mintNFT() {
  const recipient = document.getElementById("recipient").value;
  if (!recipient) return alert("Enter recipient address!");

  contract = new ethers.Contract(contractAddress, contractABI, signer);
  try {
    const tx = await contract.mintNFT(recipient);
    document.getElementById("status").innerText = "Minting...";
    await tx.wait();
    document.getElementById("status").innerText = "NFT Minted!";

    // Add minted NFT dynamically
    sampleNFTs.push({ name: `NFT #${sampleNFTs.length + 1}`, img: "img/baton_racket.png" });
    loadNFTs();
  } catch (err) {
    console.error(err);
    document.getElementById("status").innerText = "Error minting NFT.";
  }
}

// Event listeners
document.getElementById("connectWallet").onclick = connectWallet;
document.getElementById("mintNFT").onclick = mintNFT;
window.onload = loadNFTs;

buyBtn.onclick = async () => {
  if (!selectedNFT || !signer) return alert("Connect your wallet first!");

  try {
    const contractWithSigner = new ethers.Contract(contractAddress, contractABI, signer);
    const tokenId = selectedNFT.id || 1; // use tokenId if available
    const price = ethers.parseEther(selectedNFT.price.toString());

    const tx = await contractWithSigner.buyNFT(tokenId, { value: price });
    alert("Transaction sent! Waiting for confirmation...");
    await tx.wait();
    alert("NFT purchased successfully! 🎉");

    // Refresh NFTs after purchase
    loadNFTs();
    modal.style.display = "none";

    // Confetti celebration
    confetti({
      particleCount: 200,
      spread: 120,
      origin: { y: 0.6 },
      colors: ['#ff0a54','#ff477e','#ff7096','#ff85a1','#fbb1b1','#f9bec7']
    });
  } catch (err) {
    console.error(err);
    alert("Purchase failed. See console for details.");
  }
};
