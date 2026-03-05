import { Droplets, Activity, FlaskConical, BarChart3 } from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { to: "/", label: "Dashboard", icon: BarChart3 },
  { to: "/samples", label: "Samples", icon: FlaskConical },
  { to: "/reports", label: "Reports", icon: Activity },
];

const Header = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-header text-header-foreground border-b border-border/30">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Droplets className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">AquaWatch</h1>
            <p className="text-xs text-header-foreground/60">Urban Water Quality Monitor</p>
          </div>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {user ? (
            // show normal nav when logged in
            navItems.map(({ to, label, icon: Icon }) => {
              const isActive = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "flex items-center gap-1.5 transition-colors",
                    isActive
                      ? "text-header-foreground font-medium"
                      : "text-header-foreground/50 hover:text-header-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })
          ) : (
            // show auth links when not logged in
            <> 
              <Link
                to="/login"
                className={cn(
                  "transition-colors",
                  pathname === "/login"
                    ? "text-header-foreground font-medium"
                    : "text-header-foreground/50 hover:text-header-foreground"
                )}
              >
                Log in
              </Link>
              <Link
                to="/register"
                className={cn(
                  "transition-colors",
                  pathname === "/register"
                    ? "text-header-foreground font-medium"
                    : "text-header-foreground/50 hover:text-header-foreground"
                )}
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
          <div className="flex items-center gap-4">
            {user && (
              <button
                onClick={handleLogout}
                className="text-sm text-header-foreground/60 hover:text-header-foreground transition-colors"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>
  );
};

export default Header;
