import type { Book } from "@/lib/types";
import moment from "moment";
import { ThumbsUpIcon } from "lucide-react";

interface Props {
  book: Book;
}

export default function BookDetalils({ book }: Props) {
  return (
    <div className=" text-blue-400 p-4  mx-auto">
      <div className=" flex gap-10">
        <div className="relative">
          <img
            className="max-w-[300px] h-auto rounded-2xl shadow-lg"
            src={book.coverImage}
            alt={book.title}
          />
          <span className=" mt-4 rounded-full bg-green-200 px-4 py-2 flex items-center justify-center gap-2 absolute top-0 right-0 text-black">
            {book.likes}
            <ThumbsUpIcon />
          </span>
        </div>
        <div className=" p-3 flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-blue-600">{book.title}</h1>
          <p className="text-gray-600">
            By {book.authors}, {moment(book.publishDate).format("YYYY")}
          </p>
          <p className="text-gray-600 w-50">ISBN: {book.isbn}</p>
          <p className="text-gray-600">Publisher: {book.publisher}</p>
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Reviews:</h3>
            <div className="space-y-4">
              {book.reviews?.map((review) => (
                <div
                  key={review.date}
                  className="bg-gray-50 rounded-lg p-4 shadow-sm"
                >
                  <p className="text-gray-700 mb-2 break-words">
                    "{review.text}"
                  </p>
                  <p className="text-gray-600 font-medium italic">
                    — {review.author}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
