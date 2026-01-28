import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const handleOk = () => {
    if (dontShowAgain) {
      localStorage.setItem('hide404Warning', 'true');
    }
    navigate('/');
  };

  return (
    <div 
      className="min-h-screen w-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #5a9fd4 0%, #306998 100%)',
      }}
    >
      {/* XP Error Dialog */}
      <div className="w-full max-w-md">
        {/* Window Container */}
        <div className="bg-white rounded-lg overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)' }}>
          {/* Title Bar */}
          <div className="xp-title-bar h-[30px] flex items-center justify-between px-2">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-gradient-to-br from-red-500 via-yellow-500 to-blue-500 rounded-sm flex items-center justify-center">
                <span className="text-[8px] text-white font-bold">XP</span>
              </div>
              <span className="text-white font-bold text-[13px]">Windows</span>
            </div>
            <button 
              onClick={handleOk}
              className="xp-control-btn xp-close hover:brightness-110 transition-all"
            >
              <X className="w-3 h-3 text-primary-foreground" strokeWidth={3} />
            </button>
          </div>

          {/* Dialog Content */}
          <div className="p-6">
            {/* Warning Icon and Message */}
            <div className="flex gap-4 mb-6">
              {/* Warning Icon */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-gray-800" strokeWidth={2} />
                </div>
              </div>

              {/* Message */}
              <div className="flex-1">
                <p className="text-[11px] text-gray-800 leading-relaxed">
                  <strong>Page Not Found (Error 404)</strong>
                  <br />
                  <br />
                  The page you are looking for at <span className="font-mono bg-gray-100 px-1">{location.pathname}</span> does not exist. 
                  <br />
                  <br />
                  Click <strong className="text-blue-600 cursor-pointer hover:underline" onClick={handleOk}>OK</strong> to return to My Portfolio.
                </p>
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-center gap-2 mb-4 ml-16">
              <input
                type="checkbox"
                id="dontShow"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-4 h-4 border-2 border-gray-400 rounded-sm cursor-pointer"
              />
              <label htmlFor="dontShow" className="text-[11px] text-gray-800 cursor-pointer select-none">
                Don't show this message again
              </label>
            </div>

            {/* OK Button */}
            <div className="flex justify-center">
              <button
                onClick={handleOk}
                className="xp-button px-8 py-1.5 min-w-[80px] text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-blue-400"
                autoFocus
              >
                OK
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info Text Below */}
        <div className="text-center mt-4">
          <p className="text-white text-[10px] opacity-80">
            If you continue to experience problems, please contact your system administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;