import { useQuery } from "@tanstack/react-query";
import type { FetchBooksParams } from "@/lib/types";
import { fetchBooks } from "@/lib/api";
import { ChevronDown } from "lucide-react";
import BookDetalils from "./book-detalils";
import { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
const even = (i: number) => i % 2 === 0;

const BookList = ({
  seed,
  page,
  langCode,
  likesAvg,
  reviewsAvg,
}: FetchBooksParams) => {
  const [selectedIsbn, setSelectedIsbn] = useState<string | null>(null);
  const { data, isFetching } = useQuery({
    queryKey: ["books"],
    queryFn: () => fetchBooks(seed, page, langCode, likesAvg, reviewsAvg),
    enabled: seed !== 0,
  });

  console.log(data);

  const handleShowTable = (isbn: string) => {
    setSelectedIsbn((prev) => (prev === isbn ? null : isbn));
  };
  if (isFetching) {
    return <div className="text-center py-4">Loading...</div>;
  }
  return (
    <div className="w-full">
      <table className="table-auto w-full">
        <thead className="">
          <tr className=" bg-cyan-950 text-amber-100">
            <th className="p-3 text-left">ISBN</th>
            <th className="p-3 text-left">Title</th>
            <th className="p-3 text-left">Author(s)</th>
            <th className="p-3 text-left" colSpan={2}>
              Publisher
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((book, i) => (
            <>
              <tr
                key={book.isbn}
                onClick={() => handleShowTable(book.isbn)}
                className={`
                  ${
                    even(i)
                      ? "bg-gray-800 text-amber-50 hover:bg-gray-500"
                      : "bg-gray-600 text-amber-100 hover:bg-gray-400"
                  } cursor-pointer 
                `}
              >
                <td className="">{book.isbn}</td>
                <td>{book.title}</td>
                <td>{book.authors.join(", ")}</td>
                <td className="">{book.publisher}</td>
                <td>
                  <ChevronDown
                    className={`transition-transform ${
                      selectedIsbn === book.isbn ? "rotate-180" : ""
                    }`}
                  />
                </td>
              </tr>
              {selectedIsbn === book.isbn && (
                <tr className="bg-gray-800 w-full">
                  <td colSpan={5} className="p-0">
                    <BookDetalils book={book} />
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookList;
