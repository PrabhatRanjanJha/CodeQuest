import { Routes, Route, Navigate } from "react-router-dom";
import { useGame } from "./context/useGame";
import Auth from "./pages/Auth";
import Game from "./pages/Game";

export default function App() {
  const { user } = useGame();
  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/" /> : <Auth />} />
      <Route path="/*" element={user ? <Game /> : <Navigate to="/auth" />} />
    </Routes>
  );
}