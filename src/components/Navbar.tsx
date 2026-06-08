"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Bell, ChevronDown, LogOut, Menu, Play, Search, User, X } from "lucide-react";
import { toast } from "sonner";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/lib/auth-context";
import { useProfileStore } from "@/store/useProfileStore";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "/browse" },
  { label: "TV Shows", href: "/browse?type=tv" },
  { label: "Movies", href: "/browse?type=movie" },
  { label: "New & Popular", href: "/browse?sort=new" },
  { label: "My List", href: "/my-list" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const { currentProfile } = useProfileStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out");
    router.push("/auth/login");
  };

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 w-full px-4 py-4 transition-all duration-300 md:px-12",
        isScrolled ? "bg-background/90 shadow-xl shadow-black/20 backdrop-blur-xl" : "bg-gradient-to-b from-black/80 to-transparent"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/browse" className="group flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary transition-transform group-hover:scale-105">
              <Play className="h-4 w-4 fill-white text-white" />
            </span>
            <span className="text-xl font-black uppercase italic tracking-normal text-white md:text-2xl">
              Stream<span className="text-primary">Vault</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href.split("?")[0];
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                    active ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          <form
            onSubmit={handleSearch}
            className={cn(
              "flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1 transition-all duration-300",
              isSearchVisible ? "w-48 opacity-100 md:w-64" : "w-10 opacity-100 md:w-64"
            )}
          >
            <button
              type="button"
              onClick={() => setIsSearchVisible((value) => !value)}
              className="text-zinc-300 transition hover:text-white"
              aria-label="Toggle search"
            >
              <Search className="h-5 w-5" />
            </button>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Titles, people, genres"
              className={cn(
                "w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500",
                !isSearchVisible && "hidden md:block"
              )}
            />
          </form>

          <button className="hidden text-zinc-400 transition hover:text-white md:block" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </button>
          <ThemeToggle className="hidden md:flex" />

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen((value) => !value)}
                className="flex items-center gap-2"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
                  {currentProfile?.avatar || user.displayName?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                </span>
                <ChevronDown className={cn("h-4 w-4 text-zinc-400 transition", profileDropdownOpen && "rotate-180")} />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-surface-elevated py-1 shadow-2xl">
                  <div className="border-b border-white/5 px-4 py-3">
                    <p className="truncate text-sm font-medium text-white">{currentProfile?.name || user.displayName || "Viewer"}</p>
                    <p className="truncate text-xs text-zinc-500">{user.email}</p>
                  </div>
                  <Link href="/profiles" className="flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5 hover:text-white">
                    <User className="h-4 w-4" />
                    Switch Profile
                  </Link>
                  <Link href="/account" className="block px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5 hover:text-white">
                    Account Settings
                  </Link>
                  <Link href="/subscribe" className="block px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5 hover:text-white">
                    Plans
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login" className="rounded-full bg-primary px-5 py-1.5 text-sm font-semibold text-white">
              Sign In
            </Link>
          )}

          <button
            type="button"
            className="text-zinc-300 transition hover:text-white lg:hidden"
            onClick={() => setMobileMenuOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="absolute left-0 top-full w-full border-t border-white/5 bg-surface-elevated py-4 lg:hidden">
          <div className="flex flex-col gap-4 px-6">
            {NAV_LINKS.map((link) => (
              <Link key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-zinc-300 hover:text-white">
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 border-t border-white/5 pt-4">
              <ThemeToggle />
              <span className="text-sm text-zinc-500">Theme</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
