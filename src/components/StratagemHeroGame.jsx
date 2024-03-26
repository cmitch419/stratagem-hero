import { useEffect, useState } from 'react';
import { Box, LinearProgress, Stack, Typography, useTheme } from '@mui/material';

import useGamepad from '../hooks/useGamepad';
import useKeyboard from '../hooks/useKeyboard';
import stratagemsData from '../data/stratagemsData';
import { Events, GameStates, useGameFSM } from '../hooks/gameFSM';

import { ArrowCombo } from './Stratagem';
import { StratagemIcon } from './StratagemIcon';
import playSound from './Sounds';
import useGameConfig from '../hooks/useGameConfig';

// @TODO: MASSIVE TODO, this thing is too huge and too complex for what it does.

// const WIDTH = 510;
// const HEIGHT = 293;
const WIDTH = 1000;
const HEIGHT = WIDTH * 0.575;

function StratagemHeroGame({
    scale,
    screenWidth = WIDTH,
    screenHeight = HEIGHT,
    disabledStratagems
}) {
    const theme = useTheme();
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
    }
    const keyboardInput = useKeyboard();
    const gamepadInput = useGamepad();

    const { currentState, transition } = useGameFSM();

    const [gameState, setGameState] = useState(initialGameState);
    const [roundState, setRoundState] = useState(initialRoundState);
    const [roundTimerId, setRoundTimerId] = useState(null);


    // ------STATE CHANGES-----
    useEffect(() => {
        // Any time there is a game state change, the round timer should be cleared
        if (roundTimerId) clearInterval(roundTimerId);
        switch (currentState) {
            case GameStates.GAME_READY:
                playSound('gameStart');
                resetGame();
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


    // EVENT HANDLERS
    function handleStartGame() {
        transition(Events.START_GAME);
    }
    function handleBeginRound() {
        setUpNextRound();
        // transition(Events.BEGIN_ROUND);
    }
    function handleRoundCompleted() {
        transition(Events.ROUND_COMPLETED);
    }
    function handleRoundFailed() {
        transition(Events.ROUND_FAILED);
    }
    function handleNextRound() {
        transition(Events.NEXT_ROUND);
    }
    function handleQuit() {
        transition(Events.QUIT);
    }
    function handleNewGame() {
        transition(Events.NEW_GAME);
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

    const StartScreen = () => {
        return <Stack justifyContent="center" alignItems="center" spacing={5} sx={{
            height: '100%'
        }}>
            <Typography variant="h1">
                Stratagem Hero
            </Typography>
            <Stack justifyContent="space-around" alignItems="center">
                <Typography variant="h4" color='primary' sx={{ textTransform: 'none' }}>
                    Enter any Stratagem Input to Start!
                </Typography>
                <Box sx={{
                    width: '75%',
                    pt: '1rem',
                }}>

                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" color="secondary">Mobile:</Typography>
                        <Typography component="span" sx={{ textTransform: 'none' }} >On-Screen D-Pad in lower left</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" color="secondary">Keyboard:</Typography>
                        <Typography component="span" sx={{ textTransform: 'none' }} >W A S D and Arrow Keys</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" color="secondary">Controller:</Typography>
                        <Typography component="span" sx={{ textTransform: 'none' }} >D-Pad</Typography>
                    </Stack>
                </Box>
            </Stack>
        </Stack>
    };
    const RoundStartScreen = () => {
        const { round } = gameState;

        return currentState === GameStates.ROUND_STARTING
            ? <Stack spacing={2} justifyContent="center" alignItems="center">
                <Typography variant="h1">
                    Get Ready
                </Typography>
                <Stack justifyContent="center" alignItems="center">
                    <Typography variant="h5" sx={{ textTransform: 'none' }}>Round</Typography>
                    <Typography variant="h2" color='primary'>{round}</Typography>
                </Stack>
            </Stack>
            : <></>
    };

    const GameOverScreen = () => {
        const { score } = gameState;
        return <Stack spacing={1} justifyContent="center" alignItems="center">
            <Typography variant="h1">
                GAME OVER
            </Typography>
            <Typography variant="h6">High scores</Typography>
            <Typography>1. thyancey : 999999</Typography>
            <Typography>2. cmitch419 : 999999</Typography>
            <Typography>3. DefinitelyNotAnAutomaton : 999999</Typography>
            <Typography variant="h6">Your final score</Typography>
            <Typography variant="h3" color="primary">{score}</Typography>
        </Stack>
    };

    const RoundEndScreen = () => {
        const { roundBonus, timeBonus, perfectRoundBonus } = roundState;
        const { score } = gameState;

        const [show, setShow] = useState(1);

        useEffect(() => {
            const displayInterval = setInterval(() => {
                if (show <= 4) {
                    setShow(prev => prev + 1);
                } else {
                    clearInterval(displayInterval);
                }
            }, 600);
            return () => clearInterval(displayInterval);
        }, []);

        return <Stack spacing={1} sx={{
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'space-between',
            flexDirection: 'column',
            width: '100%',
            height: '80%',
        }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{
                visibility: show < 0 ? 'hidden' : 'unset'
            }}>
                <Typography variant="h5" sx={{ textTransform: 'none' }}>
                    Round Bonus
                </Typography>
                <Typography variant="h3" color="primary">
                    {roundBonus}
                </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{
                visibility: show < 1 ? 'hidden' : 'unset'
            }}>
                <Typography variant="h5" sx={{ textTransform: 'none' }}>
                    Time Bonus
                </Typography>
                <Typography variant="h3" color="primary">
                    {timeBonus}
                </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{
                visibility: show < 2 ? 'hidden' : 'unset'
            }}>
                <Typography variant="h5" sx={{ textTransform: 'none' }}>
                    Perfect Bonus
                </Typography>
                <Typography variant="h3" color="primary">
                    {perfectRoundBonus}
                </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{
                visibility: show < 3 ? 'hidden' : 'unset'
            }}>
                <Typography variant="h5" sx={{ textTransform: 'none' }}>
                    Total Score
                </Typography>
                <Typography variant="h3" color="primary">
                    {score}
                </Typography>
            </Stack>
        </Stack>
    };

    const RoundScreen = () => {
        const { round, score } = gameState;
        const { stratagems, stratagemIndex, valid, inputSequence, timeRemaining } = roundState;


        return <Box sx={{
            display: 'grid',
            gridTemplateRows: [.116, .406, .27, .208].map(ratio => `${ratio * screenHeight}px`).join(' '),
            gridTemplateColumns: [.167, .629, .167].map(ratio => `${ratio * screenWidth}px`).join(' '),
            gridTemplateAreas: `
            "blank1 blank1 blank1"
            "round game1 score"
            "round game2 score"
            "blank2 blank2 blank2"
            `,
            width: `${screenWidth}px`,
            justifyContent: 'center',
            alignItems: 'center',
            height: `${screenHeight}px`,
        }}>
            <Box sx={{
                gridArea: 'blank1',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
            }}>
            </Box>
            <Box sx={{
                gridArea: 'round',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                height: '100%',
                width: '100%',
            }}>
                <Typography sx={{ height: `${0.05 * screenHeight}px`, fontSize: `${0.05 * screenHeight}px`, textTransform: 'none' }}>Round</Typography>
                <Typography sx={{ height: `${0.092 * screenHeight}px`, fontSize: `${0.092 * screenHeight}px`, textTransform: 'none' }} color={roundState.valid ? 'primary' : 'error'}>{round}</Typography>
                <Typography sx={{ pt: `${0.015 * screenHeight}px`, height: `${0.05 * screenHeight}px`, fontSize: `${0.05 * screenHeight}px`, textTransform: 'none', visibility: 'hidden' }}>Round</Typography>
            </Box>
            <Box sx={{
                gridArea: 'score',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                justifyContent: 'flex-start',
                height: '100%',
                width: '100%',
            }}>
                <Typography sx={{ height: `${0.05 * screenHeight}px`, fontSize: `${0.05 * screenHeight}px`, textTransform: '', visibility: 'hidden' }}>Score</Typography>
                <Typography sx={{ height: `${0.092 * screenHeight}px`, fontSize: `${0.092 * screenHeight}px`, textTransform: 'none' }} color={roundState.valid ? 'primary' : 'error'}>{score}</Typography>
                <Typography sx={{ pt: `${0.015 * screenHeight}px`, height: `${0.05 * screenHeight}px`, fontSize: `${0.05 * screenHeight}px`, textTransform: '' }}>Score</Typography>
            </Box>
            <Box sx={{
                gridArea: 'game1',
                display: 'flex',
                height: '100%',
                width: '100%',
            }}>
                <Box sx={{
                    width: `100%`,
                    height: `100%`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                    }}>
                        <Stack direction="row" sx={{
                            display: 'flex',
                            height: '100%',
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <StratagemIcon {...stratagems[stratagemIndex]}
                                showBorder
                                gameModeBorder={`4px solid ${valid ? theme.palette.primary.main : theme.palette.error.main}`}
                                height={`${Math.min(0.15 * screenWidth, 0.26 * screenHeight)}px`}
                                width={`${Math.min(0.15 * screenWidth, 0.26 * screenHeight)}px`}
                            />
                            <Stack direction="row" sx={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                height: `${Math.min(0.15 * screenWidth, 0.26 * screenHeight)}px`,
                                width: `${0.461 * screenWidth}px`,
                            }}>
                                {[1, 2, 3, 4, 5].map((offset, i) => {
                                    const stratagem = stratagems[stratagemIndex + offset] || null;
                                    return <Box key={i} sx={{
                                        ml: i !== stratagemIndex - 1 ? `3px` : 0,
                                    }}>
                                        {stratagem
                                            ? <StratagemIcon {...stratagem}
                                                width={`${Math.min(0.075 * screenWidth, 0.14 * screenHeight)}px`}
                                                height={`${Math.min(0.075 * screenWidth, 0.14 * screenHeight)}px`} />
                                            : <Box sx={{
                                                width: `${Math.min(0.075 * screenWidth, 0.14 * screenHeight)}px`,
                                                height: `${Math.min(0.075 * screenWidth, 0.14 * screenHeight)}px`,
                                            }} />}
                                    </Box>
                                })}
                            </Stack>
                        </Stack>
                    </Box>
                    <Typography sx={{
                        height: `${0.0683 * screenHeight}px`,
                        backgroundColor: roundState.valid ? theme.palette.primary.main : theme.palette.error.main,
                        color: theme.palette.background.default,
                        fontSynthesis: 'weight',
                        fontWeight: 900,
                        fontSize: `${0.05 * screenHeight}px`,
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        display: 'flex',
                    }}>{stratagems[stratagemIndex]?.name}</Typography>


                </Box>
            </Box>

            <Box sx={{
                gridArea: 'game2',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                height: '100%',
            }}>
                <Box sx={{
                    // width: '100%',
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: `${0.133 * screenHeight}px`,
                }}>
                    <ArrowCombo {...stratagems[stratagemIndex]}
                        valid={valid}
                        colorCurrent={theme.palette.primary.main}
                        colorUpcoming='white'
                        colorInvalid={theme.palette.error.main}
                        colorEntered={theme.palette.primary.main}
                        inputSequence={inputSequence}
                        height={`${0.133 * screenHeight}px`}
                    />
                </Box>
                <LinearProgress
                    variant='determinate'
                    color={roundState.valid ? 'primary' : 'error'}
                    value={100 * timeRemaining / (stratagemHeroConfig.timePerRound * 1000)}
                    sx={{
                        height: `${0.051 * screenHeight}px`,
                        mt: `${0.085 * screenHeight}px`,
                        width: '100%'
                    }} />
            </Box>

            <Box sx={{
                gridArea: 'blank2',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                // height: '100%',
                backgroundColor: 'red'
            }}>
            </Box>
        </Box>
    };

    return (<Box sx={{
        width: screenWidth,
        height: screenHeight,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `scale(${scale},${scale})`,
    }}>
        {currentState === GameStates.GAME_READY && <StartScreen />}
        {currentState === GameStates.ROUND_STARTING && <RoundStartScreen />}
        {currentState === GameStates.ROUND_IN_PROGRESS && <RoundScreen />}
        {currentState === GameStates.ROUND_ENDING && <RoundEndScreen />}
        {currentState === GameStates.GAME_OVER && <GameOverScreen />}
    </Box>);
}

export default StratagemHeroGame;