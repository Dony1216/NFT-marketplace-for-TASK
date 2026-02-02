import { useState } from "react";
import { Button } from "../atoms/Button";

interface ListNFTFormProps {
  onSubmit: (price: number) => void;
}

export const ListNFTForm: React.FC<ListNFTFormProps> = ({ onSubmit }) => {
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  const validate = (value: string) => {
    if (!value) return "Price is required";
    const num = Number(value);
    if (isNaN(num)) return "Invalid number";
    if (num <= 0) return "Price must be greater than 0";
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPrice(value);
    setError(validate(value));
  };

  const handleSubmit = () => {
    const err = validate(price);
    if (err) {
      setError(err);
      return;
    }
    onSubmit(Number(price));
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-bold text-white">List NFT</h3>

      {/* Price Input */}
      <div>
        <label className="text-sm text-gray-400 mb-1 block">
          Price (ETH)
        </label>
        <input
          type="number"
          step="0.0001"
          placeholder="0.05"
          value={price}
          onChange={handleChange}
          className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-white focus:outline-none focus:border-purple-500"
        />
        {error && (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        )}
      </div>

      {/* Submit */}
      <Button
        className="w-full"
        disabled={!!error || !price}
        onClick={handleSubmit}
      >
        List for Sale
      </Button>
    </div>
  );
};
