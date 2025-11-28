"use client";
import Link from "next/link";
import { useState } from "react";
import logo from "../../../../public/logo.png";

export default function Navbar() {
  const [query, setQuery] = useState("");

  function onSearch(e) {
    e.preventDefault();
    alert(`Searching for: ${query}`);
  }
// 

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand / Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-slate-900"
            >
              <img src={logo.src} alt="Logo" className="h-12 w-auto" />
            </Link>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {/* <Link
              href="/"
              className="text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              Home
            </Link> */}

        
          </div>

          {/* Search + Bill */}
          <div className="flex items-center space-x-3">
            {/* <form onSubmit={onSearch} className="flex items-center">
              <label htmlFor="search" className="sr-only">
                Search
              </label>

              <div className="relative">
                <input
                  id="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-40 sm:w-64 lg:w-80 border border-slate-200 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Search products..."
                />

                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100"
                ></button>
              </div>
            </form> */}

            <Link
              href="/bil"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6"
                />
              </svg>

              <span className="text-sm font-medium">Bill</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
