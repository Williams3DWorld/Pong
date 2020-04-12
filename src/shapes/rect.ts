const PIXI = require('pixi.js');

import { Shape } from "./shape"

// Abstract shape class that extends pixi graphics
export class Rect extends Shape {
    private _w;
    private _h;

    constructor(stage, x: number, y: number, w: number, h: number) {
        super();

        this._w = w;
        this._h = h;

        this.create();

        this.x = x;
        this.y = y;

        this.assignToStage(stage);
    }

    create(): void {
        this.beginFill(0xffffff);
        this.drawRect(0, 0, this._w, this._h);
        this.endFill();
    }
}