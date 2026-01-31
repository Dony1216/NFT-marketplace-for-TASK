import React, { useState, useRef, useEffect } from "react";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import { Button } from "../components/atoms/Button";
import { Input } from "../components/atoms/Input";
import { Badge } from "../components/atoms/Badge";
import { Upload, CheckCircle2, Loader2 } from "lucide-react";
import { uploadFileToIPFS, uploadMetadata } from "../../pinata";
import { getNFTContract } from "../../web3";
import { useNFTs } from "../../context/NFTContext";


type Step = "upload" | "preview" | "mint";

export const CreateNFTPage: React.FC = () => {
  const { addNFT } = useNFTs();
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    blockchain: "ethereum" as "ethereum" | "polygon" | "solana",
    category: "Art",
    royalties: "10",
  });

  // Logic from file2
  const [loading, setLoading] = useState(false);
  const [canMint, setCanMint] = useState(true);
  const [cooldownLeft, setCooldownLeft] = useState(0);
  const [gasCost, setGasCost] = useState<number | string | null>(null);
  const [totalCost, setTotalCost] = useState<number | string | null>(null);
  const MINT_FEE = 0.01;

  const blockchainOptions = [
    { value: "ethereum", label: "Ethereum", color: "purple" },
    { value: "polygon", label: "Polygon", color: "cyan" },
    { value: "solana", label: "Solana", color: "success" },
  ] as const;

  const categories = ["Art", "Gaming", "Animals", "Music", "Others"];

  const steps = [
    { id: "upload", label: "Upload", number: 1 },
    { id: "preview", label: "Preview", number: 2 },
    { id: "mint", label: "Mint", number: 3 },
  ];

  /* ---------------- COOLDOWN ---------------- */

  async function checkCooldown() {
    try {
      if (!window.ethereum) return;

      const nft = await getNFTContract();
      const accounts = await window.ethereum!.request({
        method: "eth_requestAccounts",
      }) as string[];

      const [account] = accounts;

      const lastMint = await nft.lastMintTime(account);
      const cooldown = await nft.mintCooldown();
      const now = Math.floor(Date.now() / 1000);
      const end = Number(lastMint) + Number(cooldown);

      if (now >= end) {
        setCanMint(true);
        setCooldownLeft(0);
      } else {
        setCanMint(false);
        setCooldownLeft(end - now);
      }
    } catch (err) {
      console.error("Cooldown check failed", err);
    }
  }

  useEffect(() => {
    checkCooldown();
  }, []);

  useEffect(() => {
    if (cooldownLeft <= 0) return;
    const timer = setInterval(() => {
      setCooldownLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanMint(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownLeft]);

  function formatTime(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  /* ---------------- IMAGE HANDLING ---------------- */

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setUploadedImage(file);
      setCurrentStep("preview");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      setCurrentStep("preview");
    }
  };

  /* ---------------- GAS ESTIMATION ---------------- */

  async function estimateMintGas(metadataUrl: string) {
    try {
      if (!window.ethereum) {
  throw new Error("MetaMask is not installed");
}
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const nft = await getNFTContract(true);
      const gasLimit = await nft.mint.estimateGas(metadataUrl, {
        value: ethers.parseEther(MINT_FEE.toString()),
      });
      const feeData = await provider.getFeeData();
      const gasPrice = feeData.gasPrice ?? feeData.maxFeePerGas ?? ethers.parseUnits("1", "gwei");
      const gasEth = ethers.formatEther(gasLimit * gasPrice);
      setGasCost(Number(gasEth).toFixed(6));
      setTotalCost((Number(gasEth) + MINT_FEE).toFixed(6));
    } catch (err) {
      console.error("Gas estimation failed", err);
      setGasCost("—");
      setTotalCost("—");
    }
  }

  /* ---------------- CREATE NFT ---------------- */
console.log(formData.category)
  async function createNFT() {
    if (!canMint) {
      alert(`⏳ Cooldown active. Please wait ${formatTime(cooldownLeft)}.`);
      return;
    }

    if (!uploadedImage || !formData.title || !formData.description || !formData.category) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      // Upload image
      const imageUrl = await uploadFileToIPFS(uploadedImage);
      const creators = await window.ethereum!.request({
        method: "eth_requestAccounts",
      }) as string[];

      const [creator] = creators;

      // Upload metadata
      const metadataUrl = await uploadMetadata(
        formData.title,
        formData.description,
        imageUrl,
        creator,
        formData.category
      );

      // Estimate gas
      await estimateMintGas(metadataUrl);

      // Mint
      const nft = await getNFTContract(true);
      const tx = await nft.mint(metadataUrl, {
        value: ethers.parseEther(MINT_FEE.toString()),
      });
      await tx.wait();

      setCurrentStep("mint");
      await checkCooldown();
    } catch (err: any) {
      console.error(err);
      let message = err?.reason || err?.data?.message || err.message;
      if (message?.includes("cooldown")) {
        alert("⏳ Please wait before minting again.");
      } else if (message?.includes("Mint fee")) {
        alert("💰 Not enough ETH to mint.");
      } else if (message?.includes("user rejected")) {
        alert("❌ Transaction cancelled.");
      } else {
        alert("⚠️ " + message);
      }
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- RENDER ---------------- */

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Create Your NFT
          </h1>
          <p className="text-muted-foreground text-lg">
            Mint your digital artwork on the blockchain
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-12">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${currentStep === step.id
                      ? "bg-purple-500 border-purple-500 text-white"
                      : steps.findIndex((s) => s.id === currentStep) > index
                        ? "bg-purple-500/20 border-purple-500 text-purple-400"
                        : "bg-white/5 border-purple-500/20 text-muted-foreground"
                    }`}
                >
                  {steps.findIndex((s) => s.id === currentStep) > index ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <span className="font-bold">{step.number}</span>
                  )}
                </div>
                <span
                  className={`text-sm mt-2 ${currentStep === step.id ? "text-purple-400" : "text-muted-foreground"
                    }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-24 h-0.5 mx-4 mb-6 transition-all duration-300 ${steps.findIndex((s) => s.id === currentStep) > index
                      ? "bg-purple-500"
                      : "bg-purple-500/20"
                    }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {/* Step 1: Upload */}
          {currentStep === "upload" && (
            <div className="space-y-8">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative p-12 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer ${isDragging
                    ? "border-purple-500 bg-purple-500/10"
                    : "border-purple-500/30 bg-gradient-to-br from-white/5 to-white/[0.02] hover:border-purple-500/50 hover:bg-purple-500/5"
                  }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <Upload className="w-10 h-10 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">Upload Your Artwork</h3>
                  <p className="text-muted-foreground mb-4">
                    Drag and drop or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supported formats: JPG, PNG, GIF, SVG (Max 50MB)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Preview */}
          {currentStep === "preview" && uploadedImage && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Preview */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Live Preview</h3>
                <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-purple-500/20">
                  <img
                    src={URL.createObjectURL(uploadedImage)}
                    alt="NFT Preview"
                    className="w-full aspect-square object-cover"
                  />
                  <div className="p-4">
                    <h4 className="text-lg font-semibold mb-2">{formData.title || "Untitled NFT"}</h4>
                    <p className="text-sm text-muted-foreground mb-4">{formData.description || "No description"}</p>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={
                          blockchainOptions.find((b) => b.value === formData.blockchain)?.color || "purple"
                        }
                      >
                        {blockchainOptions.find((b) => b.value === formData.blockchain)?.label}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Form */}
              <div className="space-y-4 mt-4">
                <Input
                  label="Title *"
                  placeholder="Enter NFT title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                <textarea
                  className="w-full h-1/3 p-4 rounded-lg bg-white/5 border border-purple-500/20 text-foreground placeholder:text-muted-foreground focus:outline-none"
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3 rounded-lg bg-white/5 border border-purple-500/20 text-foreground"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} >
                      {cat}
                    </option>
                  ))}
                </select>

                {/* Gas + cooldown info */}
                <div className="bg-slate-900/70 backdrop-blur-md p-6 rounded-xl text-sm text-gray-400 mb-4">
                  <p>💰 Mint fee: <b>{MINT_FEE} ETH</b></p>
                  <p>⏳ Cooldown: <b>5 minutes</b></p>
                  <p>⛽ Gas: <b>{gasCost ?? "—"} ETH</b></p>
                  <p>🧮 Total: <b>{totalCost ?? "—"} ETH</b></p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="ghost" onClick={() => setCurrentStep("upload")} className="flex-1">
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    onClick={createNFT}
                    disabled={loading || !canMint || !formData.title}
                    className="flex-1"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Mint NFT"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Mint success */}
          {currentStep === "mint" && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  NFT Minted Successfully!
                </span>
              </h2>
              <Button variant="primary" onClick={() => window.location.href = "/my-nfts"}>
                View My NFTs
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
