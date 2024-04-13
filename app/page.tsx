"use client";

import { useState } from "react";

type SearchResults = { index: string; image_url: string; summary: string }[];

const art = `
 ▄▄▄▄▄▄▄ ▄▄▄ ▄▄▄▄▄▄▄ ▄▄▄▄▄▄▄ ▄▄▄▄▄▄▄ ▄▄▄▄▄▄▄ 
█       █   █       █       █       █       █
█    ▄  █   █       █  ▄▄▄▄▄█    ▄▄▄█   ▄   █
█   █▄█ █   █     ▄▄█ █▄▄▄▄▄█   █▄▄▄█  █▄█  █
█    ▄▄▄█   █    █  █▄▄▄▄▄  █    ▄▄▄█       █
█   █   █   █    █▄▄ ▄▄▄▄▄█ █   █▄▄▄█   ▄   █
█▄▄▄█   █▄▄▄█▄▄▄▄▄▄▄█▄▄▄▄▄▄▄█▄▄▄▄▄▄▄█▄▄█ █▄▄█

`;

export default function Home() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResults>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query) return;

    // Make an API request to search for the query
    try {
      const response = await fetch(
        `https://picsea.reevemarcbarreto.xyz/search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        }
      );

      const data = await response.json();

      setSearchResults(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 ">
      <div className="flex flex-col items-center">
        <pre className="text-xs md:text-md">{art}</pre>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full md:flex-row gap-2 p-4 justify-center"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your search query"
            className="text-sm md:w-80 rounded border border-stone-400 bg-stone-100 px-2 py-2 focus:outline-none focus:ring-2 focus:ring-sky-700"
          />
          <button
            type="submit"
            className="text-sm bg-gray-800 text-gray-100 py-2 px-6 rounded hover:bg-gray-900"
          >
            Search
          </button>
        </form>
      </div>

      {/* Display search results here (conditional rendering based on results) */}
      {searchResults.length > 0 && (
        <div className="mt-2 p-4">
          <p className="text-xs md:text-sm">
            Showing top {searchResults.length} results:
          </p>
          <div className="masonry sm:masonry-sm md:masonry-md mt-2">
            {/* Map over searchResults and render each result */}
            {searchResults.map((result) => (
              <div key={result.index} className="overflow-hidden mb-[2em]">
                <img
                  src={result.image_url}
                  alt="search result"
                  className="w-full h-full object-cover rounded"
                />
                <p className="text-xs mt-1">{result.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
