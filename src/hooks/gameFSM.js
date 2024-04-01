import { useEffect, useState } from 'react';
import useKeyboard from './useKeyboard';
import useGameConfig from './useGameConfig';
import stratagemsData from '../data/stratagemsData';
import useGameSound from './useGameSound';
import useGamepad from './useGamepad';

export const GameStates = {
    GAME_READY: 'GAME_READY',
    ROUND_STARTING: 'ROUND_STARTING',
    ROUND_IN_PROGRESS: 'ROUND_IN_PROGRESS',
    ROUND_ENDING: 'ROUND_ENDING',
    GAME_OVER: 'GAME_OVER',
    USERNAME_ENTRY: 'USERNAME_ENTRY',
};

export const Events = {
    START_GAME: 'START_GAME',
    BEGIN_ROUND: 'BEGIN_ROUND',
    ROUND_COMPLETED: 'ROUND_COMPLETED',
    ROUND_FAILED: 'ROUND_FAILED',
    NEXT_ROUND: 'NEXT_ROUND',
    QUIT: 'QUIT',
    NEW_GAME: 'NEW_GAME',
    NEW_HIGHSCORE: 'NEW_HIGH_SCORE',
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
        [Events.NEW_HIGHSCORE]: GameStates.USERNAME_ENTRY,
    },
    [GameStates.USERNAME_ENTRY]: {
        [Events.USERNAME_ENTERED]: GameStates.GAME_OVER,
    }
};


export function useGameFSM(disabledStratagems) {
    const keyboardInput = useKeyboard();
    const gamepadInput = useGamepad();
    const {
        gameConfig: stratagemHeroConfig
    } = useGameConfig();

    const initialGameState = {
        round: 0,
        score: 0,
    };
    const initialRoundState = {
        timeRemaining: stratagemHeroConfig.timePerRound * 1000,
        stratagems: [],
        stratagemIndex: 0,
        perfectRoundBonus: stratagemHeroConfig.perfectBonus,
        roundBonus: 0,
        timeBonus: 0,
        valid: true,
        inputSequence: [],
    };
    const { isHighscoreEligible } = useGameConfig();
    const { playSound } = useGameSound();

    const [currentState, setCurrentState] = useState(initialState);
    const [gameState, setGameState] = useState(initialGameState);
    const [roundState, setRoundState] = useState(initialRoundState);
    const [timeoutId, setTimeoutId] = useState(null);
    const [userName, setUserName] = useState(null);
    const [roundTimerId, setRoundTimerId] = useState(null);

    // ---------User direction input handling---------
    useEffect(() => {
        if (keyboardInput.direction) {
            switch (currentState) {
                case GameStates.GAME_READY:
                    handleStartGame();
                    break;
                case GameStates.ROUND_IN_PROGRESS:
                    playSound('directionInput');
                    setRoundState(prev => ({
                        ...prev,
                        inputSequence: [...prev.inputSequence, keyboardInput.direction]
                    }));
                    break;
                default:
                    break;
            }
        }
    }, [keyboardInput.direction]);
    useEffect(() => {
        if (gamepadInput.direction) {
            switch (currentState) {
                case GameStates.GAME_READY:
                    handleStartGame();
                    break;
                case GameStates.ROUND_IN_PROGRESS:
                    playSound('directionInput');
                    setRoundState(prev => ({
                        ...prev,
                        inputSequence: [...prev.inputSequence, gamepadInput.direction]
                    }));
                    break;
                default:
                    break;
            }
        }
    }, [gamepadInput.direction]);

    // useEffect to watch current state and handle state transitions
    useEffect(() => {
        console.debug(`STATE: ${currentState}`);
        switch(currentState) {
            case GameStates.GAME_OVER:
                if (isHighscoreEligible(disabledStratagems) && !userName) {
                    transition(Events.NEW_HIGHSCORE);
                } else {
                    transitionWithTimeout(Events.NEW_GAME, 5000);
                }
                break;
            case GameStates.ROUND_STARTING:
                transitionWithTimeout(Events.BEGIN_ROUND, 2500);
                break;
            case GameStates.ROUND_ENDING:
                transitionWithTimeout(Events.NEXT_ROUND, 4* 1000);
                break;
            case GameStates.GAME_READY:
            case GameStates.ROUND_IN_PROGRESS:
            case GameStates.USERNAME_ENTRY:
                break;
            }
        return () => {
            // Clear the previous timeout when the component unmounts or when currentState changes
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        }
    }, [currentState]);


    function resetGame() {
        setGameState(() => ({
            ...initialGameState
        }));
    }

    function setUpNewGame() {
    }

    function setUpNextRound() {
        setRoundState(() => ({
            ...initialRoundState,
            stratagems: getStratagems(gameState.round),
        }));
        setGameState(prevState => ({
            ...prevState,
            round: prevState.round + 1,
        }));
    }

    const startRound = () => {
        const id = setInterval(() => {
            if (currentState === GameStates.ROUND_IN_PROGRESS) {
                let newTime = 0
                setRoundState((prevState) => {
                    // Game over, ran out of time
                    if (prevState.timeRemaining <= 0) {
                        endRound(false);
                        clearInterval(roundTimerId);
                    } else {
                        newTime = prevState.timeRemaining - stratagemHeroConfig.updateIntervalMs;
                    }
                    return { ...prevState, timeRemaining: newTime }
                });
            }
        }, stratagemHeroConfig.updateIntervalMs);
        setRoundTimerId(id);
    };

    const getStratagems = (round) => {
        const maxStratagems = Math.min(
            round + stratagemHeroConfig.minGemsPerRound,
            stratagemHeroConfig.maxGemsPerRound
        );
        const stratagems = [];
        for (let i = 0; i < maxStratagems; i++) {
            stratagems.push(getStratagem());
        }
        return stratagems;
    };

    const getStratagem = () => {
        const filteredStratagems = stratagemsData.filter((v) => !disabledStratagems.has(v.id));
        return filteredStratagems[Math.floor(Math.random() * filteredStratagems.length)];
    };

    const endRound = (success) => {
        if (success) {
            // User beat the round!
            const newRoundBonus = 50 + gameState.round * 25;
            const newTimeBonus = Math.ceil(100 * roundState.timeRemaining / (stratagemHeroConfig.timePerRound * 1000));
            const totalBonus = newRoundBonus + newTimeBonus + roundState.perfectRoundBonus;
            setRoundState(prevState => ({
                ...prevState,
                roundBonus: newRoundBonus,
                timeBonus: newTimeBonus,
            }));
            setGameState(prevState => ({
                ...prevState,
                score: prevState.score + totalBonus
            }));
            handleRoundCompleted();
        } else {
            // User lost the round :C
            handleRoundFailed();
        }
    };

    // ------STATE CHANGES-----
    useEffect(() => {
        // Any time there is a game state change, the round timer should be cleared
        if (roundTimerId) clearInterval(roundTimerId);
        switch (currentState) {
            case GameStates.GAME_READY:
                handleStartGame();
                break;
            case GameStates.ROUND_STARTING:
                playSound('roundStart');
                setUpNextRound();
                break;
            case GameStates.ROUND_IN_PROGRESS:
                startRound();
                break;
            case GameStates.ROUND_ENDING:
                playSound('roundEnd');
                break;
            case GameStates.GAME_OVER:
                playSound('gameOver');
                setUpNewGame();
                break;
        }
    }, [currentState]);

    function transition(event) {
        const nextState = stateTransitions[currentState][event];
        console.debug(`Transition: ${currentState} <${event}> --> ${nextState}`)
        if (nextState) {
            setCurrentState(nextState);
        } else {
            console.error(`Invalid transition from state ${currentState} with event ${event}`);
        }
    }
    
    // EVENT HANDLERS
    function handleStartGame() {
        playSound('gameStart');
        transition(Events.START_GAME);
    }
    function handleRoundCompleted() {
        transition(Events.ROUND_COMPLETED);
    }
    function handleRoundFailed() {
        transition(Events.ROUND_FAILED);
    }

    useEffect(() => {
        if (roundState.inputSequence.length > 0) {
            const checkInputSequence = () => {
                const { stratagems, stratagemIndex, inputSequence } = roundState;
                const currentStratagem = stratagems[stratagemIndex];
                for (let i = 0; i < inputSequence.length; i++) {
                    if (inputSequence[i] !== currentStratagem.code[i]) {
                        // Incorrect input, start over on the current combo
                        setRoundState(prevState => ({ ...prevState, valid: false }));
                        setTimeout(() => {
                            setRoundState(prevState => ({ ...prevState, valid: true, inputSequence: [], perfectRoundBonus: 0 }));
                        }, stratagemHeroConfig.timeBetweenGems * 1000);
                        return;
                    }
                }
                // Correct input sequence
                if (inputSequence.length === currentStratagem.code.length) {
                    setGameState(prevState => (
                        {
                            ...prevState,
                            score: prevState.score + currentStratagem.code.length * stratagemHeroConfig.pointsPerArrow,
                        }));
                    setRoundState(prevState => ({
                        ...prevState,
                        timeRemaining: Math.min(prevState.timeRemaining + stratagemHeroConfig.timeBonusPerGem * 1000, stratagemHeroConfig.timePerRound * 1000)
                    }));
                    if (stratagemIndex === stratagems.length - 1) {
                        // Round completed
                        endRound(true);
                        // handleRoundCompleted();
                    } else {
                        // Move to the next stratagem
                        setTimeout(() => {
                            setRoundState(prevState => ({
                                ...prevState,
                                stratagemIndex: prevState.stratagemIndex + 1,
                                inputSequence: []
                            }));
                        }, stratagemHeroConfig.timeBetweenGems * 1000);
                    }
                }
            };
            switch (currentState) {
                case GameStates.ROUND_IN_PROGRESS:
                    setRoundState(prevState => ({ ...prevState, valid: true }));
                    checkInputSequence();
                    break;
                default:
                    break;
            }
        }
    }, [currentState, roundState.inputSequence.length]);

    
    function transitionWithTimeout(event, timeoutDuration) {
        const nextState = stateTransitions[currentState][event];
        console.debug(`Setting up transition with timeout: ${currentState} <${event}> ${timeoutDuration} --> ${nextState}`)
        
        if (timeoutId) clearTimeout(timeoutId);
        
        const id = setTimeout(() => {
            transition(event);
        }, timeoutDuration);

        setTimeoutId(id);
    }

    return { currentState, gameState, roundState, stratagemHeroConfig };
}

