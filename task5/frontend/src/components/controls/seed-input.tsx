import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type React from "react";

interface SeedInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function SeedInput({ value, onChange }: SeedInputProps) {
  const generateRandomSeed = () => {
    onChange(Math.floor(Math.random() * 1000000));
  };


  return (
    <div className="space-y-2 w-full md:w-1/4">
      <label className="test-sm front-medium">Seed</label>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(Number(e.target.value))
          }
          placeholder="Enter a seed"
        />
        <Button onClick={generateRandomSeed} variant="outline">
          🎲 Random
        </Button>
      </div>
    </div>
  );
}
