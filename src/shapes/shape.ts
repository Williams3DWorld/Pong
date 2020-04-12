const PIXI = require("pixi.js");

// Abstract shape class that extends pixi graphics
export abstract class Shape extends PIXI.Graphics {

    // Override constructor
    constructor() {
        super();
    }

    // Assign variable to stage
    protected assignToStage(stage) {
        stage.addChild(this);
    }

    // Abstract functions
    abstract create(): void;
}