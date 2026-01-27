const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("🚀 Deploying contracts with account:", deployer.address);
  console.log(
    "💰 Deployer balance:",
    hre.ethers.formatEther(await deployer.provider.getBalance(deployer.address)),
    "ETH"
  );

  // 👉 Constructor params
  const initialOwner = deployer.address;
  const royaltyReceiver = deployer.address;
  const royaltyFee = 500; // 5% (500 / 10000)

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(
    initialOwner,
    royaltyReceiver,
    royaltyFee
  );

  await nft.waitForDeployment();

  console.log("✅ NFT deployed to:", await nft.getAddress());

    // ===== MARKETPLACE DEPLOY =====
  const Marketplace = await hre.ethers.deployContract("Marketplace");
  await Marketplace.waitForDeployment();

  const marketplaceAddress = await Marketplace.getAddress();
  console.log("Marketplace deployed to:", marketplaceAddress);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
