"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Bell, User, LogOut, ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "/browse" },
  { label: "TV Shows", href: "/browse?type=tv" },
  { label: "Movies", href: "/browse?type=movie" },
  { label: "New & Popular", href: "/browse?sort=new" },
  { label: "My List", href: "/browse?list=mine" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim().length >= 3) {
      router.push(`/search?q=${encodeURIComponent(value)}`);
    } else if (value.length === 0) {
      router.push('/browse');
    }
  };

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500 px-4 md:px-12 py-4",
        isScrolled ? "bg-[#0d0c1d]/90 backdrop-blur-md shadow-xl" : "bg-transparent"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-black tracking-tighter text-[#7c3aed]">
            STREAMVAULT
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-4">
            <form
              onSubmit={handleSearch}
              className={cn(
                "flex items-center gap-2 px-2 py-1 rounded-full border border-white/10 bg-white/5 transition-all duration-300",
                isSearchVisible ? "w-48 md:w-64 opacity-100" : "w-10 opacity-0 md:opacity-100 md:bg-transparent md:border-transparent"
              )}
            >
              <button
                type="button"
                onClick={() => setIsSearchVisible(!isSearchVisible)}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
              <input
                type="text"
                placeholder="Titles, people, genres"
                className={cn(
                  "bg-transparent text-sm text-white outline-none placeholder-gray-500 w-full transition-all",
                  isSearchVisible ? "opacity-100" : "opacity-0 pointer-events-none md:hidden"
                )}
                value={searchQuery}
                onChange={onSearchChange}
              />
            </form>

            <button className="hidden md:block text-gray-300 hover:text-white transition-colors">
              <Bell className="h-5 w-5" />
            </button>
          </div>

          {session ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 group"
              >
                <div className="h-8 w-8 rounded bg-[#7c3aed] flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                  {session.user?.name?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                </div>
                <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform", profileDropdownOpen && "rotate-180")} />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md bg-[#1a192f] py-2 shadow-2xl border border-white/5 animate-in fade-in zoom-in duration-200">
                  <div className="px-4 py-2 border-b border-white/5">
                    <p className="text-sm font-medium text-white truncate">{session.user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
                  </div>
                  <Link
                    href="/profiles"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                  >
                    <User className="h-4 w-4" />
                    Manage Profiles
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="rounded bg-[#7c3aed] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#7c3aed]/90 transition-colors"
            >
              Sign In
            </Link>
          )}

          <button
            className="lg:hidden text-gray-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#1a192f] border-t border-white/5 py-4 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-4 px-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-gray-300 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            {!session && (
              <Link
                href="/auth/login"
                className="text-lg font-medium text-[#7c3aed]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
