import { useEffect, useState } from 'react';
import stratagemsData from '../data/stratagemsData.json';
import { ArrowBack, ArrowDownward, ArrowForward, ArrowUpward } from '@mui/icons-material';
import useKeyboard from '../hooks/useKeyboard';
import Stratagem, { ArrowCombo } from './Stratagem';
import { StratagemIcon } from './StratagemIcon';
import { Box, LinearProgress, Stack, Typography } from '@mui/material';
import { Events, GameStates, useGameFSM } from '../hooks/gameFSM';

const stratagemHeroConfig = {
    pointsPerArrow: 5,
    minGemsPerRound: 6,
    maxGemsPerRound: 16,
    incGemsPerRound: 1,
    perfectBonus: 100,
    roundBonusBase: 50,
    roundBonusMultiplier: 25,
    timePerRound: 15,
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

function StratagemHero() {
    const input = useKeyboard();
    const { currentState, transition } = useGameFSM();

    const [gameState, setGameState] = useState(initialGameState);
    const [roundState, setRoundState] = useState(initialRoundState);

    const [roundTimerId, setRoundTimerId] = useState(null);

    window.cs = currentState;
    window.gs = gameState;
    window.rs = roundState;

    // ------STATE CHANGES-----
    useEffect(() => {
        // Any time there is a game state change, the round timer should be cleared
        if (roundTimerId) clearInterval(roundTimerId);
        switch (currentState) {
            case GameStates.GAME_READY:
                resetGame();
                break;
            case GameStates.ROUND_STARTING:
                setUpNextRound();
                break;
            case GameStates.ROUND_IN_PROGRESS:
                startRound();
                break;
            case GameStates.ROUND_ENDING:
                break;
            case GameStates.GAME_OVER:
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
                    setRoundState(prevState=>({
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

    // return (<>
    //     <div>roundInProgress: { JSON.stringify(roundInProgress) } </div>
    //     <div>timeRemaining: { JSON.stringify(timeRemaining) } </div>
    //     {/* <div>stratagems: { JSON.stringify(stratagems.length) } </div> */}
    //     {/* <div>stratagemIndex: { JSON.stringify(stratagemIndex) } </div> */}
    //     <div>stratagem: { JSON.stringify(stratagems?.[stratagemIndex]?.code) } </div>
    //     <div>perfectRoundBonus: { JSON.stringify(perfectRoundBonus) } </div>
    //     <div>round: { JSON.stringify(round) } </div>
    //     <div>score: { JSON.stringify(score) } </div>
    //     <div>roundScore: { JSON.stringify(roundScore) } </div>
    //     <div>inputSequence: { JSON.stringify(inputSequence) } </div>

    // </>)

    const ICON_WIDTH = 5;

    const StartScreen = () => {
        return currentState === GameStates.GAME_READY
            ? <Stack justifyContent="center" alignItems="center">
                <Typography variant="h1">
                    STRATAGEM HERO
                </Typography>
                <Typography variant="h6">
                    Enter any Stratagem Input to Start!
                </Typography>
            </Stack>
            : <></>
    };
    const RoundStartScreen = () => {
        const { round } = gameState;
        return currentState === GameStates.ROUND_STARTING
            ? <Stack justifyContent="center" alignItems="center">
                <Typography variant="h1">
                    GET READY
                </Typography>
                <Stack justifyContent="center" alignItems="center">
                    <Typography variant="h6">Round</Typography>
                    <Typography variant="h3">{round}</Typography>
                </Stack>
            </Stack>
            : <></>
    };
    const GameOverScreen = () => {
        const { round, score } = gameState;
        return currentState === GameStates.GAME_OVER
            ? <Stack justifyContent="center" alignItems="center">
                <Typography variant="h1">
                    GAME OVER
                </Typography>
            </Stack>
            : <></>
    };

    const RoundEndScreen = () => {
        const { roundBonus, timeBonus, perfectRoundBonus } = roundState;
        const { score } = gameState;

        return (currentState === GameStates.ROUND_ENDING
            ? <Stack>
                <Stack direction="row" justifyContent="space-between">
                    <Typography>
                        Round Bonus
                    </Typography>
                    <Typography color="yellow">
                        {roundBonus}
                    </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                    <Typography>
                        Time Bonus
                    </Typography>
                    <Typography color="yellow">
                        {timeBonus}
                    </Typography>
                </Stack>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography>
                            Perfect Bonus
                        </Typography>
                        <Typography color="yellow">
                            {perfectRoundBonus}
                        </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography>
                            Total Score
                        </Typography>
                        <Typography color="yellow">
                            {score}
                        </Typography>
                    </Stack>
            </Stack>
            : <></>
        )
    };

    const RoundScreen = () => {
        const { round, score } = gameState;
        const { stratagems, stratagemIndex, valid, inputSequence, timeRemaining } = roundState;

        return currentState === GameStates.ROUND_IN_PROGRESS
            ? <Box sx={{
                display: 'grid',
                gridTemplateRows: 'auto',
                gridTemplateColumns: '0.1fr 1 0.1fr',
                gridTemplateAreas: `"round game score"`,
            }}>
                <Box sx={{
                    gridArea: 'round',
                }}>
                    <Typography variant="h6">Round</Typography>
                    <Typography variant="h5" color="yellow">{round}</Typography>
                </Box>
                <Box sx={{
                    gridArea: 'game',
                }}>
                    <Stack direction="row" sx={{
                        flex: 1,
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        width: `${ICON_WIDTH * 2 + ICON_WIDTH * 5}rem`,
                        height: `${ICON_WIDTH * 2}rem`,
                    }}>
                        {stratagems.map((stratagem, i) =>
                            <Box key={i} pl={i !== stratagemIndex ? `${1}rem` : 0}>
                                <StratagemIcon {...stratagem}
                                    showBorder
                                    width={i === stratagemIndex ? '10rem' : '5rem'}
                                    height={i === stratagemIndex ? '10rem' : '5rem'}
                                />
                            </Box>
                        ).slice(stratagemIndex, stratagemIndex + 6)}
                    </Stack>
                    <Typography sx={{
                        background: 'yellow',
                        color: 'black'
                    }}>{stratagems[stratagemIndex]?.name}</Typography>
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
                            colorCurrent='yellow'
                            colorUpcoming='white'
                            colorInvalid='red'
                            colorEntered='yellow'
                            inputSequence={inputSequence}
                        />
                    </Box>
                    <LinearProgress
                        variant='determinate'
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
                }}>
                    <Typography variant="h5" color="yellow">{score}</Typography>
                    <Typography variant="h6">Score</Typography>
                </Box>
            </Box>
            : <></>;
    };

    return (<Box>
        <StartScreen />
        <RoundStartScreen />
        <RoundScreen />
        <RoundEndScreen />
        <GameOverScreen />
    </Box>);
}

export default StratagemHero;