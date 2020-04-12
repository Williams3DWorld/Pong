import { Vec2 } from "../data/vector"
import { ObserverDelegates } from "./observer"
import { AppData } from "../data/gameData"
import { BallData } from "../data/gameData"
import { GameDelegates } from "../game"
import { Rect } from "../shapes/rect"

import sound from 'pixi-sound';

export class Ball implements ObserverDelegates {

    private _game_subject: GameDelegates;
    private _speed: number;
    public get getSpeed(): number {
        return this._speed;
    }
    public setSpeed(speed) {
        this._speed = speed;
    }
    private _direction: Vec2;
    public get getDir() {
        return this._direction;
    }
    public setDir(dir: Vec2) {
        this._direction = dir;
    }

    private _ball_rect: Rect;
    public get getX(): number {
        return this._ball_rect.x;
    }
    public get getY(): number {
        return this._ball_rect.y;
    }

    private _out_of_bound_state: number;
    public get getOutOfBoundState(): number {
        return this._out_of_bound_state;
    }
    public setOutOfBoundState(value: number) {
        this._out_of_bound_state = value;
    }

    constructor(game: GameDelegates, stage) {
        this._game_subject = game;
        this._game_subject.registerObserver(this);

        this._speed = BallData.MAX_SPEED / 2;
        this._direction = new Vec2(0.5, 0);
        this._ball_rect = new Rect(stage, BallData.POSITION_X, 300, BallData.SIZE, BallData.SIZE);
        this._out_of_bound_state = 0;

        // First spawn
        let dir_rand = Math.floor(Math.random() * 2);
        let dir = dir_rand == 0 ? -1 : 1;
        this.spawnBall(dir);
    }

    // This may be called from the Subject
    private spawnBall(dir: number) {
        let angle = Math.floor(Math.random() * 120 + -60)
        let angle_rad = angle * Math.PI / 180;
        this._direction.x = Math.cos(1 * angle_rad) * dir;
        this._direction.y = Math.sin(1 * angle_rad);
        this._speed = Math.random() * BallData.MAX_SPEED + 4;
        this._ball_rect.x = BallData.POSITION_X;
        this._ball_rect.y = Math.random() * (AppData.height - 210) + 100;
    }

    /**
     * Update functions from subject
     */
    onPlayerScore(paddleID: number, score: Vec2) {
        this._out_of_bound_state = 0;
        this.spawnBall(paddleID);  // Respawn the ball to the opposing loser
    }

    public reflectY() {
        this._direction.y *= -1;
    }

    public reflectX() {
        this._direction.x *= -1;
    }

    public update() {
        // Check if the ball is currently inside game view
        if (this._out_of_bound_state == 0) {
            if (this._ball_rect.x < 0 - BallData.SIZE) {
                this._out_of_bound_state = -1;
            }
            else if (this._ball_rect.x > AppData.width)
                this._out_of_bound_state = 1;
            else {
                this._ball_rect.x += (this._speed) * this._direction.x;
                this._ball_rect.y += (this._speed) * this._direction.y;
            }

            // Reflect if ball hits top/bottom
            if ((this._ball_rect.y + BallData.SIZE >= AppData.height ||
                (this._ball_rect.y <= 0))) {
                sound.play("hit");
                this.reflectY();
            }
        }
    }
}