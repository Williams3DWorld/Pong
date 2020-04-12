import { Vec2 } from "../data/vector"

// All observers will share the same delegates
export interface ObserverDelegates {
    onPlayerScore(paddleID: number, score: Vec2);
}