import { ObserverDelegates } from "./observers/observer"
import { Controller } from "./observers/controller"
import { Ball } from "./observers/ball"
import { Scoreboard } from "./observers/scoreboard"
import { GameData, AppData, PaddleData, BallData } from "./data/gameData"
import { Vec2 } from "./data/vector"
import { DashedLine } from "./shapes/dashedLine"

const PIXI = require('pixi.js');
const Keyboard = require('pixi.js-keyboard');

import sound from 'pixi-sound';


// Subject delegates
export interface GameDelegates {
    registerObserver(o: ObserverDelegates);
    removeObserver(o: ObserverDelegates);
    notifyOnScore();
}

// Main game class
export class Game implements GameDelegates {
    private _paddle_hit: boolean;
    private _game_score: boolean;
    private _current_hitter: number;
    private _observers: ObserverDelegates[] = [];
    private _score: Vec2;
    private _controllers: Controller[] = [];
    private _ball: Ball;
    private _scoreboard: Scoreboard;
    private _dashed_line: DashedLine;

    constructor(stage) {
        this._paddle_hit = false;
        this._game_score = false;
        this._score = new Vec2(0, 0);
        this._dashed_line = new DashedLine(0, 0, 0, AppData.height, stage);
        this._scoreboard = new Scoreboard(this, stage);
        this._ball = new Ball(this, stage);
        this._controllers.push(new Controller(this, stage, GameData.CONTROLLER_A_X, GameData.CONTROLLER_Y));
        this._controllers.push(new Controller(this, stage, GameData.CONTROLLER_B_X, GameData.CONTROLLER_Y));
        this._current_hitter = this._ball.getDir.x > 0 ? 1 : 0;
    }

    registerObserver(o: ObserverDelegates) {
        this._observers.push(o);
    }

    removeObserver(o: ObserverDelegates) {
        let index = this._observers.indexOf(o);
        this._observers.slice(index, 1);
    }

    // Notify all observers when player scores
    notifyOnScore() {
        for (let observer of this._observers) {
            observer.onPlayerScore(this._ball.getOutOfBoundState, this._score);
        }
    }

    // Check the intersection between both paddles and ball
    checkBallPaddle() {

        let dist_x = Math.abs(this._ball.getX - this._controllers[this._current_hitter].getX + 1);
        let ball_y = this._ball.getY;
        let paddle_y = this._controllers[this._current_hitter].getY;
        let ball_center_y = ball_y + BallData.SIZE / 2;
        let paddle_center_y = paddle_y + PaddleData.PADDLE_HEIGHT / 2;

        // Check paddle collision
        if ((dist_x <= 20)) {
            // Front faces
            if ((ball_y <= paddle_y + PaddleData.PADDLE_HEIGHT) && (ball_y >= paddle_y))
                this._paddle_hit = true;

            // Top and bottom faces
            else if ((ball_center_y + BallData.SIZE > paddle_center_y - PaddleData.PADDLE_HEIGHT / 2 &&
                ball_center_y - BallData.SIZE < paddle_center_y - PaddleData.PADDLE_HEIGHT / 2) ||
                (ball_center_y - BallData.SIZE < paddle_center_y + PaddleData.PADDLE_HEIGHT / 2 &&
                    ball_center_y + BallData.SIZE > paddle_center_y + PaddleData.PADDLE_HEIGHT / 2)) {
                this._ball.reflectY();
                let angle = Math.random() - 150 * -100;
                let angle_rad = angle * Math.PI / 180;
                this._ball.setDir(new Vec2(this._ball.getDir.x, Math.sin(1 * angle_rad)));
                this._ball.setSpeed(Math.random() * BallData.MAX_SPEED + 4);
                this._paddle_hit = true;
            }
        }

        if (this._paddle_hit) {
            this._ball.reflectX();
            this._ball.setSpeed(Math.random() * BallData.MAX_SPEED + 4);
            this._current_hitter = this._current_hitter == 0 ? 1 : 0;
            sound.play("hit");
            this._paddle_hit = false;
        }
    }

    // Game loop
    public update() {

        // Update the controller input
        if (Keyboard.isKeyDown('KeyW'))
            this._controllers[0].move(-1);
        else if (Keyboard.isKeyDown('KeyS'))
            this._controllers[0].move(1);
        if (Keyboard.isKeyDown('ArrowDown'))
            this._controllers[1].move(1);
        else if (Keyboard.isKeyDown('ArrowUp'))
            this._controllers[1].move(-1);

        // Cap paddles y in view
        for (let i = 0; i < GameData.NUM_PLAYERS; i++) {
            if (this._controllers[i].getY <= 0)
                this._controllers[i].setY(0);
            else if (this._controllers[i].getY + PaddleData.PADDLE_HEIGHT >= AppData.height)
                this._controllers[i].setY(AppData.height - PaddleData.PADDLE_HEIGHT);
        }

        /**
         * Check if there's currently a game score
         */
        if (!this._game_score) {
            // Update the ball object
            this._ball.update();

            // Check if ball is out of bounds
            if (this._ball.getOutOfBoundState != 0) {
                // Set game score state to true
                this._game_score = true;

                // Set score properties
                this._ball.getOutOfBoundState == -1 ? this._score.y++ : this._score.x++;
                this._current_hitter = this._ball.getDir.x > 0 ? 1 : 0;

                // Notify all observers
                this.notifyOnScore();

                // Play sound effect
                sound.play("score");
            }

            // Check for ball to paddle intersection
            this.checkBallPaddle();
        }
        else {
            if (!sound.find("score").isPlaying) {
                this._game_score = false;
            }
        }
    }
}