import { useState } from 'react';

export const GameStates = {
    GAME_READY: 'GAME_READY',
    ROUND_STARTING: 'ROUND_STARTING',
    ROUND_IN_PROGRESS: 'ROUND_IN_PROGRESS',
    ROUND_ENDING: 'ROUND_ENDING',
    GAME_OVER: 'GAME_OVER',
};

export const Events = {
    START_GAME: 'START_GAME',
    BEGIN_ROUND: 'BEGIN_ROUND',
    ROUND_COMPLETED: 'ROUND_COMPLETED',
    ROUND_FAILED: 'ROUND_FAILED',
    NEXT_ROUND: 'NEXT_ROUND',
    QUIT: 'QUIT',
    NEW_GAME: 'NEW_GAME'
};

const initialState = GameStates.GAME_READY;

const stateTransitions = {
    [GameStates.GAME_READY]: {
        [Events.START_GAME]: GameStates.ROUND_STARTING,
    },
    [GameStates.ROUND_STARTING]: {
        [Events.BEGIN_ROUND]: GameStates.ROUND_IN_PROGRESS,
    },
    [GameStates.ROUND_IN_PROGRESS]: {
        [Events.ROUND_COMPLETED]: GameStates.ROUND_ENDING,
        [Events.ROUND_FAILED]: GameStates.GAME_OVER,
    },
    [GameStates.ROUND_ENDING]: {
        [Events.NEXT_ROUND]: GameStates.ROUND_STARTING,
        [Events.QUIT]: GameStates.GAME_OVER,
    },
    [GameStates.GAME_OVER]: {
        [Events.NEW_GAME]: GameStates.GAME_READY,
    },
};

export function useGameFSM() {
    const [currentState, setCurrentState] = useState(initialState);

    const transition = (event) => {
        const nextState = stateTransitions[currentState][event];
        if (nextState) {
            setCurrentState(nextState);
        } else {
            console.error(`Invalid transition from state ${currentState} with event ${event}`);
        }
    };

    return { currentState, transition };
}

