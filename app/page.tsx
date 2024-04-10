"use client";

import { useState } from "react";

type SearchResults = { index: string; image_url: string; summary: string }[];

export default function Home() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResults>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query) return;

    // Make an API request to search for the query
    try {
      const response = await fetch(`http://13.53.39.223/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      setSearchResults(data.images);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 ">
      <div className="flex flex-col p-4 items-center">
        <h1 className="text-3xl font-black mb-4">Hello, Welcome to Picsea</h1>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your search query"
            className="text-sm w-80 rounded border border-stone-400 bg-stone-100 px-2 py-2 focus:outline-none focus:ring-2 focus:ring-sky-700"
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
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
          {/* Map over searchResults and render each result */}
          {searchResults.map((result) => (
            <div key={result.index} className="rounded p-4">
              <img
                src={result.image_url}
                alt="search result"
                className="rounded w-full h-48 object-cover"
              />
              <p className="text-sm mt-2">{result.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
