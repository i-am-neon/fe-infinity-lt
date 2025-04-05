import { Outlet } from "react-router-dom";
import { ThemeProvider } from "../components/theme-provider";

export default function Root() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background text-foreground">
        <Outlet />
      </div>
    </ThemeProvider>
  );
}

