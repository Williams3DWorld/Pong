import { Vec2 } from "../data/vector"
import { ObserverDelegates } from "./observer"
import { PaddleData } from "../data/gameData"
import { GameDelegates } from "../game"
import { Rect } from "../shapes/rect"


export class Controller implements ObserverDelegates {

    private _game_subject: GameDelegates;
    private _paddle_rect: Rect;
    public get getX(): number {
        return this._paddle_rect.x;
    }
    public get getY(): number {
        return this._paddle_rect.y;
    }
    public setY(y) {
        this._paddle_rect.y = y;
    }

    constructor(game: GameDelegates, stage, pos_x: number, pos_y: number) {
        this._game_subject = game;
        this._game_subject.registerObserver(this);
        this._paddle_rect = new Rect(stage, pos_x, pos_y, PaddleData.PADDLE_WIDTH, PaddleData.PADDLE_HEIGHT);
    }

    onPlayerScore(paddleID: number, score: Vec2) {
    }

    public move(dir: number) {
        this._paddle_rect.y += PaddleData.MOVE_SPEED * dir;
    }

    public update() {
    }
}