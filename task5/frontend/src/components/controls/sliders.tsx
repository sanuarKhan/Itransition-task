import { Slider } from "@/components/ui/slider";

interface SlidersProps {
  likesAvg: number;
  reviewsAvg: number;
  onLikesChange: (value: number) => void;
  onReviewsChange: (value: number) => void;
}

export function Sliders({
  likesAvg,
  reviewsAvg,
  onLikesChange,
  onReviewsChange,
}: SlidersProps) {
  return (
    <div className=" flex flex-col md:flex-row gap-3 w-full md:w-2/4">
      <div className="w-full md:w-1/2">
        <label className="text-sm front-medium">
          Likes: {likesAvg.toFixed(1)}
        </label>
        <Slider
          value={[likesAvg]}
          onValueChange={([value]) => onLikesChange(value)}
          min={0}
          max={10}
          step={0.1}
          className=" bg-gray-900 rounded-2xl mt-2 "
        />
      </div>
      <div className=" w-1/2">
        <label className="">Reviews: {reviewsAvg.toFixed(1)}</label>
        <Slider
          value={[reviewsAvg]}
          onValueChange={([value]) => onReviewsChange(value)}
          min={0}
          max={10}
          step={0.1}
          className=" bg-gray-900 rounded-2xl mt-2 "
        />
      </div>
    </div>
  );
}
