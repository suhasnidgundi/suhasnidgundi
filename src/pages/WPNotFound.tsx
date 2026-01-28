import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import WPStatusBar from "@/components/wp/WPStatusBar";
import WPAppBar from "@/components/wp/WPAppBar";

const WPNotFound = () => {
  const navigate = useNavigate();

  const appBarButtons = [
    {
      icon: <ArrowLeft className="w-5 h-5" />,
      label: "Back",
      onClick: () => navigate(-1),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-wp-bg text-wp-text">
      <WPStatusBar />

      {/* Panorama Header */}
      <div className="relative h-56 w-full bg-wp-accent/30 flex items-end p-6 overflow-hidden">
        <h1 className="text-[50px] font-light tracking-tight text-wp-text wp-list-enter">
          404
        </h1>
      </div>

      {/* Body */}
      <div className="flex-1 px-6 py-10 space-y-6">
        <h2 className="text-wp-text/60 uppercase tracking-wide text-[16px] wp-list-enter">
          page not found
        </h2>

        <p className="text-[16px] text-wp-text/80 leading-relaxed wp-list-enter wp-delay-1">
          The page you are looking for doesn’t exist or has been moved.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-wp-accent text-wp-bg px-5 py-3 text-[16px] font-semibold wp-list-enter wp-delay-2"
        >
          Go to Home
        </button>
      </div>

      <WPAppBar buttons={appBarButtons} />
    </div>
  );
};

export default WPNotFound;
