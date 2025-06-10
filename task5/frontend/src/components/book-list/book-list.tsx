import { useQuery } from "@tanstack/react-query";
import type { Book, FetchBooksParams } from "@/lib/types";
import { fetchBooks } from "@/lib/api";
import { ChevronDown } from "lucide-react";
import BookDetalils from "./book-detalils";
import React, { useState, useEffect, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const even = (i: number) => i % 2 === 0;

const BookList = ({
  seed,
  langCode,
  likesAvg,
  reviewsAvg,
}: FetchBooksParams) => {
  const [items, setItems] = useState<Book[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedIsbn, setSelectedIsbn] = useState<string | null>(null);

  // Create a stable key for when parameters change
  const paramKey = useMemo(
    () => `${seed}-${langCode}-${likesAvg}-${reviewsAvg}`,
    [seed, langCode, likesAvg, reviewsAvg]
  );

  // Reset state when parameters change
  useEffect(() => {
    setItems([]);
    setCurrentPage(0);
    setHasMore(true);
    setSelectedIsbn(null);
  }, [paramKey]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["books", seed, currentPage, langCode, likesAvg, reviewsAvg],
    queryFn: () =>
      fetchBooks(seed, currentPage, langCode, likesAvg, reviewsAvg),
    enabled: true, // Always enabled, but controlled by currentPage
  });

  // Handle data updates with useEffect instead of onSuccess
  useEffect(() => {
    if (data) {
      if (currentPage === 0) {
        setItems(data);
      } else {
        setItems((prev) => {
          // Prevent duplicates
          const existingIsbns = new Set(prev.map((book) => book.isbn));
          const newBooks = data.filter((book) => !existingIsbns.has(book.isbn));
          return [...prev, ...newBooks];
        });
      }

      // If received less than expected items, we've reached the end
      if (data.length < 20) {
        setHasMore(false);
      }
    }
  }, [data, currentPage]);

  const handleShowTable = (isbn: string) => {
    setSelectedIsbn((prev) => (prev === isbn ? null : isbn));
  };

  const fetchMoreData = () => {
    if (!isLoading && hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Show error state
  if (error) {
    return (
      <div className="text-center py-4 w-full h-full flex items-center justify-center text-red-500">
        Error loading books: {error.message}
      </div>
    );
  }

  // Show initial loading state
  if (isLoading && currentPage === 0) {
    return (
      <div className="text-center py-4 w-full h-full flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div
      className="w-full"
      id="scrollableDiv"
      style={{ height: "80vh", overflow: "auto" }}
    >
      <InfiniteScroll
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={
          <div className="text-center py-4">
            {isLoading ? "Loading more..." : ""}
          </div>
        }
        scrollableTarget="scrollableDiv"
        endMessage={
          <p className="text-center py-4 text-gray-500">
            <b>You have seen all books!</b>
          </p>
        }
      >
        <table className="table-auto w-full">
          <thead className="sticky top-0 bg-cyan-950 z-10">
            <tr className="text-amber-100">
              <th className="p-3 text-left">ISBN</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Author(s)</th>
              <th className="p-3 text-left" colSpan={2}>
                Publisher
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((book, i) => (
              <React.Fragment key={book.isbn}>
                <tr
                  onClick={() => handleShowTable(book.isbn)}
                  className={`
                    ${
                      even(i)
                        ? "bg-gray-800 text-amber-50 hover:bg-gray-500"
                        : "bg-gray-600 text-amber-100 hover:bg-gray-400"
                    } cursor-pointer transition-colors
                  `}
                >
                  <td className="p-3">{book.isbn}</td>
                  <td className="p-3">{book.title}</td>
                  <td className="p-3">{book.authors.join(", ")}</td>
                  <td className="p-3">{book.publisher}</td>
                  <td className="p-3">
                    <ChevronDown
                      className={`transition-transform duration-200 ${
                        selectedIsbn === book.isbn ? "rotate-180" : ""
                      }`}
                    />
                  </td>
                </tr>
                {selectedIsbn === book.isbn && (
                  <tr className="bg-gray-800">
                    <td colSpan={5} className="p-0">
                      <BookDetalils book={book} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </InfiniteScroll>
    </div>
  );
};

export default BookList;
