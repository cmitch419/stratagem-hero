import { useEffect, useState } from 'react';
import stratagemsData from '../data/stratagemsData.json';
import useKeyboard from '../hooks/useKeyboard';
import { ArrowCombo } from './Stratagem';
import { StratagemIcon } from './StratagemIcon';
import { Box, LinearProgress, Stack, Typography, useTheme } from '@mui/material';
import { Events, GameStates, useGameFSM } from '../hooks/gameFSM';

const soundPath = `${import.meta.env.BASE_URL}/sound`;
const audioGameStart = new Audio(`${soundPath}/gamestart.mp3`);
const audioRoundStart = new Audio(`${soundPath}/newround.mp3`);
const audioRoundEnd = new Audio(`${soundPath}/scorescreen.mp3`);
const audioInput = new Audio(`${soundPath}/inputdirection.mp3`);
const audioGameOver = new Audio(`${soundPath}/gameover.mp3`);

const stratagemHeroConfig = {
    pointsPerArrow: 5,
    minGemsPerRound: 6,
    maxGemsPerRound: 16,
    incGemsPerRound: 1,
    perfectBonus: 100,
    roundBonusBase: 50,
    roundBonusMultiplier: 25,
    timePerRound: 99999,
    timeBonusPerGem: 1,
    timeBetweenGems: 0.25,
    updateIntervalMs: 100,
};

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

function StratagemHero({ screenRef }) {
    const input = useKeyboard();
    const { currentState, transition } = useGameFSM();
    window.screen = screenRef

    const [gameState, setGameState] = useState(initialGameState);
    const [roundState, setRoundState] = useState(initialRoundState);

    const [roundTimerId, setRoundTimerId] = useState(null);

    const theme = useTheme();

    window.cs = currentState;
    window.gs = gameState;
    window.rs = roundState;

    // ------STATE CHANGES-----
    useEffect(() => {
        // Any time there is a game state change, the round timer should be cleared
        if (roundTimerId) clearInterval(roundTimerId);
        switch (currentState) {
            case GameStates.GAME_READY:
                audioGameStart.play();
                resetGame();
                break;
            case GameStates.ROUND_STARTING:
                audioRoundStart.play();
                setUpNextRound();
                break;
            case GameStates.ROUND_IN_PROGRESS:
                startRound();
                break;
            case GameStates.ROUND_ENDING:
                audioRoundEnd.play();
                break;
            case GameStates.GAME_OVER:
                audioGameOver.play();
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
        // const id = setInterval(() => {
        //     if (currentState === GameStates.ROUND_IN_PROGRESS) {
        //         let newTime = 0
        //         setRoundState((prevState) => {
        //             // Game over, ran out of time
        //             if (prevState.timeRemaining <= 0) {
        //                 endRound(false);
        //                 clearInterval(roundTimerId);
        //             } else {
        //                 newTime = prevState.timeRemaining - stratagemHeroConfig.updateIntervalMs;
        //             }
        //             return { ...prevState, timeRemaining: newTime }
        //         });
        //     }
        // }, stratagemHeroConfig.updateIntervalMs);
        // setRoundTimerId(id);
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

    const getStratagem = () => stratagemsData[Math.floor(Math.random() * stratagemsData.length)];

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
        if (input.direction) {
            switch (currentState) {
                case GameStates.GAME_READY:
                    handleStartGame();
                    break;
                case GameStates.ROUND_IN_PROGRESS:
                    audioInput.currentTime = 0;
                    audioInput.play();
                    setRoundState(prev => ({
                        ...prev,
                        inputSequence: [...prev.inputSequence, input.direction]
                    }));
                    break;
                default:
                    break;
            }
        }
    }, [input.direction]);


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
                            score: prevState.score + currentStratagem.code.length * 5,
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

    const ICON_WIDTH = 5;

    const StartScreen = () => {
        return <Stack justifyContent="center" alignItems="center">
            <Typography variant="h1">
                STRATAGEM HERO
            </Typography>
            <Typography variant="h6" sx={{ textTransform: 'none' }}>
                Enter any Stratagem Input to Start!
            </Typography>
        </Stack>
    };
    const RoundStartScreen = () => {
        const { round } = gameState;

        return currentState === GameStates.ROUND_STARTING
            ? <Stack justifyContent="center" alignItems="center">
                <Typography variant="h1">
                    Get Ready
                </Typography>
                <Stack justifyContent="center" alignItems="center">
                    <Typography variant="h6" sx={{ textTransform: 'none' }}>Round</Typography>
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
            justifyContent: 'space-evenly'
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
            gridTemplateRows: '10% 40% 40% 10%',
            gridTemplateColumns: '20% 60% 20%',
            gridTemplateAreas: `
            "blank1 blank1 blank1"
            "round game1 score"
            "round game2 score"
            "blank2 blank2 blank2"
            `,
            width: '100cqw',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100cqh',
        }}>
            <Box sx={{
                gridArea: 'blank1',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                backgroundColor: 'red'
            }}>
                poop
            </Box>
            <Box sx={{
                gridArea: 'round',
                height: '100%',
                width: '100%'
            }}>
                <Typography variant="h6" sx={{ textTransform: 'none' }}>Round</Typography>
                <Typography variant="h3" color={roundState.valid ? 'primary' : 'error'}>{round}</Typography>
            </Box>
            <Box sx={{
                gridArea: 'game1',
                display: 'flex',
                height: '100%',
                backgroundColor: 'green',
            }}>
                <Box sx={{
                    width: `100%`,
                    height: `100%`,
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                    backgroundColor: 'grey'
                }}>
                    <Box sx={{
                        display: 'flex',
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'brown',
                    }}>
                        <Stack direction="row" sx={{
                            backgroundColor: 'pink',
                            alignItems: 'center',
                            width: '100%'
                        }}>
                            <Box sx={{
                                width: '25%'
                            }}>
                                <StratagemIcon {...stratagems[stratagemIndex]}
                                    showBorder
                                    gameModeBorder={`4px solid ${valid ? theme.palette.primary.main : theme.palette.error.main}`}
                                    width="100%"
                                    height="100%"
                                />
                            </Box>
                            <Stack direction="row" sx={{
                                display: 'flex',
                                justifyContent: 'space-evenly',
                                alignItems: 'flex-end',
                                height: '80%',
                                flex: 1,
                                backgroundColor: 'purple'
                            }}>
                                {[1, 2, 3, 4, 5].map((offset, i) => {
                                    const stratagem = stratagems[stratagemIndex + offset] || null;
                                    return <Box key={i} sx={{
                                        ml: i !== stratagemIndex ? `1rem` : 0,
                                    }}>
                                        {stratagem ? <StratagemIcon {...stratagem} /> : <Box sx={{
                                            width: '50%'
                                        }}></Box>}
                                    </Box>
                                })}
                            </Stack>
                        </Stack>

                    </Box>

                    <Typography variant="h6" sx={{
                        backgroundColor: roundState.valid ? theme.palette.primary.main : theme.palette.error.main,
                        color: theme.palette.background.default,
                        fontSynthesis: 'weight',
                        fontWeight: 900,
                        alignItems: 'center',
                        justifyContent: 'center',
                        display: 'flex',
                    }}>{stratagems[stratagemIndex]?.name}</Typography>


                </Box>
            </Box>

            <Box sx={{
                gridArea: 'game2',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                backgroundColor: 'blue'
            }}>
                <Box sx={{
                    width: '100%',
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '3rem',
                }}>
                    <ArrowCombo {...stratagems[stratagemIndex]}
                        valid={valid}
                        colorCurrent={theme.palette.primary.main}
                        colorUpcoming='white'
                        colorInvalid={theme.palette.error.main}
                        colorEntered={theme.palette.primary.main}
                        inputSequence={inputSequence}
                        scale={2}
                    />
                </Box>
                <LinearProgress
                    variant='determinate'
                    color={roundState.valid ? 'primary' : 'error'}
                    value={100 * timeRemaining / (stratagemHeroConfig.timePerRound * 1000)}
                    sx={{
                        height: '1rem',
                        mt: '1rem',
                    }} />
            </Box>

            <Box sx={{
                gridArea: 'score',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                height: '100%',
                width: '100%',
            }}>
                <Typography variant="h3"  color={roundState.valid ? 'primary' : 'error'}>{score}</Typography>
                <Typography variant="h6" >Score</Typography>
            </Box>
            <Box sx={{
                gridArea: 'blank2',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                backgroundColor: 'red'
            }}>
            </Box>
        </Box>
    };

    return (<Box sx={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: screenRef?.current?.clientHeight || '100%',
        width: screenRef?.current?.clientWidth || '100%',
    }}>
        {currentState === GameStates.GAME_READY && <StartScreen />}
        {currentState === GameStates.ROUND_STARTING && <RoundStartScreen />}
        {currentState === GameStates.ROUND_IN_PROGRESS && <RoundScreen />}
        {currentState === GameStates.ROUND_ENDING && <RoundEndScreen />}
        {currentState === GameStates.GAME_OVER && <GameOverScreen />}
    </Box>);
}

export default StratagemHero;