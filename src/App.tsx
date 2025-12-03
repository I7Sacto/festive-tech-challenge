import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Games from "./pages/Games";
import Stories from "./pages/Stories";
import Music from "./pages/Music";
import Gifts from "./pages/Gifts";
import Gallery from "./pages/Gallery";
import NotFound from "./pages/NotFound";

// Import all games
import Quiz from "./pages/games/Quiz";
import Crossword from "./pages/games/Crossword";
import Puzzle from "./pages/games/Puzzle";
import Coding from "./pages/games/Coding";
import Networking from "./pages/games/Networking";
import Surprise from "./pages/games/Surprise";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Main pages */}
          <Route path="/" element={<Index />} />
          <Route path="/games" element={<Games />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/music" element={<Music />} />
          <Route path="/gifts" element={<Gifts />} />
          <Route path="/gallery" element={<Gallery />} />
          
          {/* Game routes */}
          <Route path="/games/quiz" element={<Quiz />} />
          <Route path="/games/crossword" element={<Crossword />} />
          <Route path="/games/puzzle" element={<Puzzle />} />
          <Route path="/games/coding" element={<Coding />} />
          <Route path="/games/networking" element={<Networking />} />
          <Route path="/games/surprise" element={<Surprise />} />
          
          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
