
import { AppData } from "./data/gameData"
import { Game } from "./game";

const PIXI = require('pixi.js');
const Keyboard = require('pixi.js-keyboard');
import sound from 'pixi-sound';

let app = new PIXI.Application(AppData);

/**
 * Callback for when window has fully loaded
 */
window.onload = function () {
    /**
     * Pre-load content
     */
    sound.add({
        score: "assets/sounds/score.wav",
        hit: "assets/sounds/hit.wav"
    });

    /**
     * Initialise game
     */
    document.body.appendChild(app.view);
    let game = new Game(app.stage);

    /**
     * Game loop function
     */
    function playLoop() {
        Keyboard.update();
        requestAnimationFrame(playLoop);
        game.update();
        app.renderer.render(app.stage);
    }

    /**
     * Play loop
     */
    playLoop();
}