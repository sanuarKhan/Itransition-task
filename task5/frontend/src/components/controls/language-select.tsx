import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LanguageSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function LanguageSelect({ value, onChange }: LanguageSelectProps) {
  return (
    <div className="space-y-2 w-1/4 ">
      <label className="test-sm front-medium">Language</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent className=" bg-cyan-950 text-blue-300">
          <SelectItem value="en">English (USA)</SelectItem>
          <SelectItem value="zh">Chinese (CHINA)</SelectItem>
          <SelectItem value="ru">Russian (Russia)</SelectItem>
          <SelectItem value="bn">Bengali (Bangladesh)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
