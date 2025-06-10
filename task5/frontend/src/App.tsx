import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import BookList from "./components/book-list/book-list";
import { LanguageSelect } from "./components/controls/language-select";
import { Sliders } from "./components/controls/sliders";
import { SeedInput } from "./components/controls/seed-input";

const queryClient = new QueryClient();
function App() {
  const [seed, setSeed] = useState(0);
  const [langCode, setLangCode] = useState("en");
  const [likesAvg, setLikesAvg] = useState(0);
  const [reviewsAvg, setReviewsAvg] = useState(0);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto px-4 py-8 bg-emerald-500 h-full">
        <div className="flex gap-10 mb-4 w-full bg-cyan-950 text-blue-300 rounded-2xl p-5">
          <LanguageSelect value={langCode} onChange={setLangCode} />
          <SeedInput value={seed} onChange={setSeed} />
          <Sliders
            likesAvg={likesAvg}
            reviewsAvg={reviewsAvg}
            onLikesChange={setLikesAvg}
            onReviewsChange={setReviewsAvg}
          />
        </div>

        <BookList
          seed={seed}
          langCode={langCode}
          likesAvg={likesAvg}
          reviewsAvg={reviewsAvg}
        />
      </div>
    </QueryClientProvider>
  );
}

export default App;
