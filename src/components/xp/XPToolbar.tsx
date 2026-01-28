import {
  ArrowLeft,
  ArrowRight,
  Search,
  Folder,
  LayoutGrid,
  ChevronDown,
  X,
} from "lucide-react";

import BackIcon from "@/assets/xp/icons/back_icon.png";
import ForwardIcon from "@/assets/xp/icons/forward_icon.png";
import SearchIcon from "@/assets/xp/icons/search_icon.png";
import FoldersIcon from "@/assets/xp/icons/folders_icon.png";
import FolderViewIcon from "@/assets/xp/icons/folder_view_icon.png";
import FolderIcon from "@/assets/xp/icons/folder_icon.png";

import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const XPToolbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Track navigation history
  useEffect(() => {
    // Simple check - if we're not on home, we can go back
    setCanGoBack(location.pathname !== "/");
    // Forward is typically handled by browser history
    setCanGoForward(false);
  }, [location.pathname]);

  const handleBack = () => {
    if (canGoBack) {
      navigate(-1);
    }
  };

  const handleForward = () => {
    if (canGoForward) {
      navigate(1);
    }
  };

  const handleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    // Simple search logic - search through available pages
    const results = [];
    const lowerQuery = query.toLowerCase();

    if ("projects".includes(lowerQuery) || "project".includes(lowerQuery)) {
      results.push({ title: "Projects", path: "/projects", type: "page" });
    }
    if (
      "experience".includes(lowerQuery) ||
      "work".includes(lowerQuery) ||
      "job".includes(lowerQuery)
    ) {
      results.push({ title: "Experience", path: "/experience", type: "page" });
    }
    if (
      "portfolio".includes(lowerQuery) ||
      "home".includes(lowerQuery) ||
      "about".includes(lowerQuery)
    ) {
      results.push({ title: "My Portfolio", path: "/", type: "page" });
    }

    setSearchResults(results);
  };

  const handleSearchResultClick = (path: string) => {
    navigate(path);
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleFolders = () => {
    // Navigate to Projects page (folder view)
    navigate("/projects");
  };

  return (
    <div className="xp-toolbar relative">
      {/* Navigation Buttons */}
      <div className="flex items-center">
        <button
          className={`xp-toolbar-btn group ${
            canGoBack ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
          }`}
          onClick={handleBack}
          disabled={!canGoBack}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center shadow-sm ${
              canGoBack
                ? "bg-gradient-to-b from-green-400 to-green-600"
                : "bg-gradient-to-b from-gray-300 to-gray-400"
            }`}
          >
            <img src={BackIcon} alt="Back" className="w-6 h-6" />
          </div>
          <span
            className={`text-[11px] text-foreground ${canGoBack ? "group-hover:underline" : ""}`}
          >
            Back
          </span>
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </button>

        <button
  className={`xp-toolbar-btn ${
    canGoForward ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'
  }`}
          onClick={handleForward}
          disabled={!canGoForward}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center shadow-sm ${
              canGoForward
                ? "bg-gradient-to-b from-green-300 to-green-500"
                : "bg-gradient-to-b from-green-300/50 to-green-500/50 opacity-50"
            }`}
          >
            <img src={ForwardIcon} alt="Forward" className="w-6 h-6" />
          </div>
        </button>
      </div>

      <div className="w-px h-5 bg-border" />

      {/* Action Buttons */}
      <button
          className={`xp-toolbar-btn ${
    isSearchOpen ? 'bg-accent/50' : ''
  }`}
        onClick={handleSearch}
      >
        <img src={SearchIcon} alt="Search" className="w-6 h-6 text-muted-foreground" />
        <span className="text-[11px] text-foreground">Search</span>
      </button>

      <button
        className="xp-toolbar-btn"
        onClick={handleFolders}
      >
        <img src={FoldersIcon} alt="Folders" className="w-6 h-6 text-yellow-500" />
        <span className="text-[11px] text-foreground">Folders</span>
      </button>

      <div className="w-px h-5 bg-border" />

      <button className="xp-toolbar-btn">
        <img src={FolderViewIcon} alt="Folder View" className="w-6 h-6 text-muted-foreground" />
        <ChevronDown className="w-3 h-3 text-muted-foreground" />
      </button>

      {/* Search Panel */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 right-0 bg-card border border-border shadow-lg z-50 mt-0">
          <div className="p-2">
            <div className="flex items-center gap-2 bg-input border border-border rounded px-2 py-1">
              <img src={SearchIcon} alt="Search" className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search My Portfolio..."
                className="flex-1 text-[11px] bg-transparent outline-none text-foreground"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="hover:bg-muted rounded p-0.5"
                >
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-2 border border-border rounded bg-background">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearchResultClick(result.path)}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-primary hover:text-primary-foreground text-left transition-colors"
                  >
                    <img src={FolderIcon} alt="Folder" className="w-4 h-4 text-yellow-500" />
                    <div>
                      <div className="text-[11px] font-bold">
                        {result.title}
                      </div>
                      <div className="text-[10px] opacity-70">
                        {result.path}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {searchQuery && searchResults.length === 0 && (
              <div className="mt-2 p-3 text-[11px] text-muted-foreground text-center">
                No results found for "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default XPToolbar;
