import {
  ChevronDown,
  X,
  ArrowUp,
} from "lucide-react";

import BackIcon from "@/assets/xp/icons/back_icon.png";
import ForwardIcon from "@/assets/xp/icons/forward_icon.png";
import SearchIcon from "@/assets/xp/icons/search_icon.png";
import FoldersIcon from "@/assets/xp/icons/folders_icon.png";
import FolderViewIcon from "@/assets/xp/icons/folder_view_icon.png";
import FolderIcon from "@/assets/xp/icons/folder_icon.png";

import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export interface XPToolbarProps {
  canGoBack?: boolean;
  canGoForward?: boolean;
  canGoUp?: boolean;
  onBack?: () => void;
  onForward?: () => void;
  onUp?: () => void;
  onFolders?: () => void;
  onNavigateFolder?: (folder: 'root' | 'projects' | 'experience') => void;
}

const XPToolbar = ({
  canGoBack: propCanGoBack,
  canGoForward: propCanGoForward,
  canGoUp: propCanGoUp,
  onBack,
  onForward,
  onUp,
  onFolders,
  onNavigateFolder,
}: XPToolbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [internalCanGoBack, setInternalCanGoBack] = useState(false);
  const [internalCanGoForward, setInternalCanGoForward] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const isControlled = onBack !== undefined;

  useEffect(() => {
    if (!isControlled) {
      setInternalCanGoBack(location.pathname !== "/");
      setInternalCanGoForward(false);
    }
  }, [location.pathname, isControlled]);

  const canGoBack = isControlled ? !!propCanGoBack : internalCanGoBack;
  const canGoForward = isControlled ? !!propCanGoForward : internalCanGoForward;
  const canGoUp = isControlled ? !!propCanGoUp : false;

  const handleBack = () => {
    if (!canGoBack) return;
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleForward = () => {
    if (!canGoForward) return;
    if (onForward) {
      onForward();
    } else {
      navigate(1);
    }
  };

  const handleUp = () => {
    if (!canGoUp) return;
    if (onUp) {
      onUp();
    } else if (onNavigateFolder) {
      onNavigateFolder('root');
    } else {
      navigate('/');
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

    const results = [];
    const lowerQuery = query.toLowerCase();

    if ("projects".includes(lowerQuery) || "project".includes(lowerQuery)) {
      results.push({ title: "Projects", path: "/projects", folderKey: "projects", type: "page" });
    }
    if (
      "experience".includes(lowerQuery) ||
      "work".includes(lowerQuery) ||
      "job".includes(lowerQuery)
    ) {
      results.push({ title: "Experience", path: "/experience", folderKey: "experience", type: "page" });
    }
    if (
      "portfolio".includes(lowerQuery) ||
      "home".includes(lowerQuery) ||
      "about".includes(lowerQuery)
    ) {
      results.push({ title: "My Portfolio", path: "/", folderKey: "root", type: "page" });
    }

    setSearchResults(results);
  };

  const handleSearchResultClick = (result: any) => {
    if (onNavigateFolder && result.folderKey) {
      onNavigateFolder(result.folderKey);
    } else {
      navigate(result.path);
    }
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleFolders = () => {
    if (onFolders) {
      onFolders();
    } else if (onNavigateFolder) {
      onNavigateFolder('projects');
    } else {
      navigate("/projects");
    }
  };

  return (
    <div className="xp-toolbar relative select-none">
      {/* Navigation Buttons */}
      <div className="flex items-center">
        {/* Back Button */}
        <button
          className={`xp-toolbar-btn group ${
            canGoBack ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
          }`}
          onClick={handleBack}
          disabled={!canGoBack}
          title="Back"
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center shadow-sm ${
              canGoBack
                ? "bg-gradient-to-b from-green-400 to-green-600"
                : "bg-gradient-to-b from-gray-300 to-gray-400 opacity-60"
            }`}
          >
            <img src={BackIcon} alt="Back" className={`w-6 h-6 ${canGoBack ? '' : 'grayscale'}`} />
          </div>
          <span
            className={`text-[11px] text-foreground font-['MSSans',Tahoma,sans-serif] ${canGoBack ? "group-hover:underline" : ""}`}
          >
            Back
          </span>
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </button>

        {/* Forward Button */}
        <button
          className={`xp-toolbar-btn ${
            canGoForward ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
          }`}
          onClick={handleForward}
          disabled={!canGoForward}
          title="Forward"
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center shadow-sm ${
              canGoForward
                ? "bg-gradient-to-b from-green-300 to-green-500"
                : "bg-gradient-to-b from-gray-300 to-gray-400 opacity-60"
            }`}
          >
            <img src={ForwardIcon} alt="Forward" className={`w-6 h-6 ${canGoForward ? '' : 'grayscale'}`} />
          </div>
        </button>

        {/* Up Button */}
        <button
          className={`xp-toolbar-btn ${
            canGoUp ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
          }`}
          onClick={handleUp}
          disabled={!canGoUp}
          title="Up to My Portfolio"
        >
          <div
            className={`w-6 h-6 rounded flex items-center justify-center border border-[#7f9db9] shadow-inner ${
              canGoUp
                ? "bg-gradient-to-b from-yellow-200 to-yellow-400 hover:from-yellow-100 hover:to-yellow-300"
                : "bg-gray-100 opacity-60"
            }`}
          >
            <ArrowUp className={`w-4 h-4 ${canGoUp ? 'text-amber-800' : 'text-gray-400'}`} strokeWidth={2.5} />
          </div>
        </button>
      </div>

      <div className="w-px h-5 bg-border mx-1" />

      {/* Action Buttons */}
      <button
        className={`xp-toolbar-btn ${isSearchOpen ? "bg-accent/50" : ""}`}
        onClick={handleSearch}
        title="Search"
      >
        <img src={SearchIcon} alt="Search" className="w-6 h-6 text-muted-foreground" />
        <span className="text-[11px] text-foreground font-['MSSans',Tahoma,sans-serif]">Search</span>
      </button>

      <button
        className="xp-toolbar-btn"
        onClick={handleFolders}
        title="Folders"
      >
        <img src={FoldersIcon} alt="Folders" className="w-6 h-6 text-yellow-500" />
        <span className="text-[11px] text-foreground font-['MSSans',Tahoma,sans-serif]">Folders</span>
      </button>

      <div className="w-px h-5 bg-border mx-1" />

      <button className="xp-toolbar-btn" title="Views">
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
                className="flex-1 text-[11px] bg-transparent outline-none text-foreground font-['MSSans',Tahoma,sans-serif]"
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
              <div className="mt-2 border border-border rounded bg-background shadow-md">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearchResultClick(result)}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#316ac5] hover:text-white text-left transition-colors cursor-pointer"
                  >
                    <img src={FolderIcon} alt="Folder" className="w-4 h-4 text-yellow-500" />
                    <div>
                      <div className="text-[11px] font-bold font-['MSSans',Tahoma,sans-serif]">
                        {result.title}
                      </div>
                      <div className="text-[10px] opacity-75">
                        {result.folderKey ? `My Portfolio > ${result.title}` : result.path}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {searchQuery && searchResults.length === 0 && (
              <div className="mt-2 p-3 text-[11px] text-muted-foreground text-center font-['MSSans',Tahoma,sans-serif]">
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
