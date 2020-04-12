import { ObserverDelegates } from "./observer";
import { GameDelegates } from "../game";
import { Vec2 } from "../data/vector";
import { GameData } from "../data/gameData";

const PIXI = require('pixi.js');


// Observer
export class Scoreboard implements ObserverDelegates {
    private _game_subject: GameDelegates;
    player_score_text: any[] = [];

    constructor(game: GameDelegates, stage) {
        this._game_subject = game;
        this._game_subject.registerObserver(this);

        for (let i = 0; i < GameData.NUM_PLAYERS; i++) {
            this.player_score_text[i] = new PIXI.Text("0", { fontFamily: "SquareFont", fontSize: 106, fill: 0xffffff, align: "center" });
            this.player_score_text[i].height += 32;
            stage.addChild(this.player_score_text[i]);
        }

        this.player_score_text[0].position.set(200, 64);
        this.player_score_text[1].position.set(700, 64);
    }

    private setScore(score_value: Vec2): void {
        this.player_score_text[0].text = `${score_value.x}`;
        this.player_score_text[1].text = `${score_value.y}`;
    }

    /**
     * 
     * @param paddleID 
     * @param score 
     */
    onPlayerScore(paddleID: number, score: Vec2) {
        this.setScore(score);
    }
}