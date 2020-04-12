export let AppData = {
    width: 900,
    height: 700,
    backgroundColor: 0x121212
};

export let PaddleData = {
    PADDLE_WIDTH: 14,
    PADDLE_HEIGHT: 46,
    MOVE_SPEED: 12
};

export let BallData = {
    SIZE: 12,
    MAX_SPEED: 8,
    POSITION_X: (AppData.width / 2) - 5
};

export let GameData = {
    NUM_PLAYERS: 2,
    MAX_SCORE_VALUE: 5,
    PADDLE_MOVE_SPEED: 10,
    BALL_MOVE_SPEED: 8,
    CONTROLLER_X_MARGIN: 60,
    CONTROLLER_A_X: (0 + 60) - (PaddleData.PADDLE_WIDTH / 2),
    CONTROLLER_B_X: (AppData.width - 60) - (PaddleData.PADDLE_WIDTH / 2),
    CONTROLLER_Y: (AppData.height / 2) - (PaddleData.PADDLE_HEIGHT / 2)
};