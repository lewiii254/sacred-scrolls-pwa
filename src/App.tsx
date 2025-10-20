import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./contexts/AuthContext";
import { BibleStudyProvider } from "./contexts/BibleStudyContext";
import { AudioProvider } from "./contexts/AudioContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ServiceWorkerUpdater } from "./components/ServiceWorkerUpdater";
import { OfflineIndicator } from "./components/OfflineIndicator";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import BibleReader from "./pages/BibleReader";
import SearchPage from "./pages/SearchPage";
import NotesPage from "./pages/NotesPage";
import BookmarksPage from "./pages/BookmarksPage";
import ProfilePage from "./pages/ProfilePage";
import DevotionalsPage from "./pages/DevotionalsPage";
import ReadingPlansPage from "./pages/ReadingPlansPage";
import CommunityPage from "./pages/CommunityPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <NotificationProvider>
          <BibleStudyProvider>
            <AudioProvider>
              <TooltipProvider>
              <ServiceWorkerUpdater />
              <OfflineIndicator />
              <PWAInstallPrompt />
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/bible" element={<BibleReader />} />
                  <Route path="/bible/:book/:chapter" element={<BibleReader />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/notes" element={<NotesPage />} />
                  <Route path="/bookmarks" element={<BookmarksPage />} />
                  <Route path="/devotionals" element={<DevotionalsPage />} />
                  <Route path="/reading-plans" element={<ReadingPlansPage />} />
                  <Route path="/community" element={<CommunityPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </AudioProvider>
        </BibleStudyProvider>
      </NotificationProvider>
    </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
