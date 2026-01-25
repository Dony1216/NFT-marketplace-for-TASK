import React, { useState, useRef } from 'react';
import { Button } from '@/app/components/atoms/Button';
import { Input } from '@/app/components/atoms/Input';
import { Badge } from '@/app/components/atoms/Badge';
import { Upload, CheckCircle2, Image as ImageIcon, Loader2 } from 'lucide-react';

type Step = 'upload' | 'preview' | 'mint';

export const CreateNFTPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    blockchain: 'ethereum' as 'ethereum' | 'polygon' | 'solana',
    category: 'Art',
    royalties: '10',
  });

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
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setCurrentStep('preview');
    };
    reader.readAsDataURL(file);
  };

  const handleMint = async () => {
    setIsMinting(true);
    // Simulate minting process
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsMinting(false);
    setCurrentStep('mint');
  };

  const blockchainOptions = [
    { value: 'ethereum', label: 'Ethereum', color: 'purple' },
    { value: 'polygon', label: 'Polygon', color: 'cyan' },
    { value: 'solana', label: 'Solana', color: 'success' },
  ] as const;

  const categories = ['Art', 'Gaming', 'Photography', 'Music', 'Virtual Worlds', 'Collectibles'];

  const steps = [
    { id: 'upload', label: 'Upload', number: 1 },
    { id: 'preview', label: 'Preview', number: 2 },
    { id: 'mint', label: 'Mint', number: 3 },
  ];

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
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  currentStep === step.id
                    ? 'bg-purple-500 border-purple-500 text-white'
                    : steps.findIndex(s => s.id === currentStep) > index
                    ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                    : 'bg-white/5 border-purple-500/20 text-muted-foreground'
                }`}>
                  {steps.findIndex(s => s.id === currentStep) > index ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <span className="font-bold">{step.number}</span>
                  )}
                </div>
                <span className={`text-sm mt-2 ${
                  currentStep === step.id ? 'text-purple-400' : 'text-muted-foreground'
                }`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-24 h-0.5 mx-4 mb-6 transition-all duration-300 ${
                  steps.findIndex(s => s.id === currentStep) > index
                    ? 'bg-purple-500'
                    : 'bg-purple-500/20'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {/* Step 1: Upload */}
          {currentStep === 'upload' && (
            <div className="space-y-8">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative p-12 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer ${
                  isDragging
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-purple-500/30 bg-gradient-to-br from-white/5 to-white/[0.02] hover:border-purple-500/50 hover:bg-purple-500/5'
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

              <div className="text-center">
                <p className="text-muted-foreground">
                  By uploading, you confirm that you own the rights to this artwork
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Preview & Details */}
          {currentStep === 'preview' && uploadedImage && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Preview Card */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Live Preview</h3>
                <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-purple-500/20">
                  <img 
                    src={uploadedImage} 
                    alt="NFT Preview"
                    className="w-full aspect-square object-cover"
                  />
                  <div className="p-4">
                    <h4 className="text-lg font-semibold mb-2">
                      {formData.title || 'Untitled NFT'}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      {formData.description || 'No description'}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Price</p>
                        <p className="text-xl font-bold">
                          {formData.price || '0'} <span className="text-sm text-purple-400">ETH</span>
                        </p>
                      </div>
                      <Badge variant={blockchainOptions.find(b => b.value === formData.blockchain)?.color || 'purple'}>
                        {blockchainOptions.find(b => b.value === formData.blockchain)?.label}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Form */}
              <div>
                <h3 className="text-xl font-semibold mb-4">NFT Details</h3>
                <div className="space-y-4">
                  <Input
                    label="Title *"
                    placeholder="Enter NFT title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />

                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-muted-foreground">Description</label>
                    <textarea
                      placeholder="Describe your NFT..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-purple-500/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 resize-none"
                    />
                  </div>

                  <Input
                    label="Price (ETH) *"
                    type="number"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />

                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-muted-foreground">Blockchain *</label>
                    <div className="grid grid-cols-3 gap-3">
                      {blockchainOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setFormData({ ...formData, blockchain: option.value })}
                          className={`p-3 rounded-lg border transition-all duration-200 ${
                            formData.blockchain === option.value
                              ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                              : 'bg-white/5 border-purple-500/20 text-muted-foreground hover:border-purple-500/30'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-muted-foreground">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="px-4 py-3 rounded-lg bg-white/5 border border-purple-500/20 text-foreground focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <Input
                    label="Royalties (%)"
                    type="number"
                    placeholder="10"
                    value={formData.royalties}
                    onChange={(e) => setFormData({ ...formData, royalties: e.target.value })}
                  />

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="ghost"
                      onClick={() => setCurrentStep('upload')}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleMint}
                      disabled={!formData.title || !formData.price || isMinting}
                      className="flex-1"
                    >
                      {isMinting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Minting...
                        </>
                      ) : (
                        'Mint NFT'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {currentStep === 'mint' && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  NFT Minted Successfully!
                </span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Your NFT has been created and is now live on the blockchain
              </p>
              
              {uploadedImage && (
                <div className="max-w-sm mx-auto mb-8">
                  <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-purple-500/20">
                    <img 
                      src={uploadedImage} 
                      alt="Minted NFT"
                      className="w-full aspect-square object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-4 justify-center">
                <Button variant="primary" onClick={() => window.location.href = '/my-nfts'}>
                  View My NFTs
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setCurrentStep('upload');
                    setUploadedImage(null);
                    setFormData({
                      title: '',
                      description: '',
                      price: '',
                      blockchain: 'ethereum',
                      category: 'Art',
                      royalties: '10',
                    });
                  }}
                >
                  Create Another
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
