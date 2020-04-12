
const PIXI = require('pixi.js');

import { Shape } from "./shape"
import { AppData } from "../data/gameData";


export class DashedLine extends Shape {
    private line_segments: any[] = [];
    private p0: number[] = [];
    private p1: number[] = [];

    constructor(x0, y0, x1, y1, stage) {
        super();

        // Assign point information
        this.p0[0] = x0;
        this.p0[1] = y0;
        this.p1[0] = x1;
        this.p1[1] = y1;

        let margin = (AppData.height / 25) / 2;
        let offset = 0;
        for (let i = 0; i < 25; i++) {
            this.line_segments[i] = new PIXI.Graphics();
            this.line_segments[i].lineStyle(6, 0xffffff);
            i == 0 ? (offset += margin / 2) : offset += margin;
            this.line_segments[i].moveTo(0, offset);
            this.line_segments[i].lineTo(0, offset + margin);
            offset += margin;

            this.line_segments[i].x = AppData.width / 2;
            stage.addChild(this.line_segments[i]);
        }
    }

    create(): void { }
}