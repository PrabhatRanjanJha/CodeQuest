import { useContext } from "react";
import { GameContext } from "./gameContextObject";

export const useGame = () => useContext(GameContext);
