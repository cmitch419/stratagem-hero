import { useEffect, useState } from 'react';
import stratagemsData from '../data/stratagemsData.json';
import { ArrowBack, ArrowDownward, ArrowForward, ArrowUpward } from '@mui/icons-material';
import useKeyboard from '../hooks/useKeyboard';
import Stratagem, { ArrowCombo } from './Stratagem';
import { StratagemIcon } from './StratagemIcon';
import { Box, LinearProgress, Stack, Typography } from '@mui/material';

const stratagemHeroConfig = {
    pointsPerArrow: 5,
    minGemsPerRound: 6,
    maxGemsPerRound: 16,
    incGemsPerRound: 1,
    perfectBonus: 100,
    roundBonusBase: 50,
    roundBonusMultiplier: 25,
    timePerRound: 250,
    timeBonusPerGem: 1,
    timeBetweenGems: 0.25,
    updateIntervalMs: 100,
};

const START_SCREEN = 0;
const ROUND_START_SCREEN = 1;
const ROUND_SCREEN = 2;
const ROUND_END_SCREEN = 3;
const GAME_OVER_SCREEN = 4;

function StratagemHero() {
    const input = useKeyboard();

    const [gameScreen, setGameScreen] = useState(START_SCREEN);
    const [roundInProgress, setRoundInProgress] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(stratagemHeroConfig.timePerRound * 1000);
    const [stratagems, setStratagems] = useState([]);
    const [stratagemIndex, setStratagemIndex] = useState(0);
    const [perfectRoundBonus, setPerfectRoundBonus] = useState(stratagemHeroConfig.perfectBonus);
    const [roundBonus, setRoundBonus] = useState(0);
    const [timeBonus, setTimeBonus] = useState(0);
    const [round, setRound] = useState(0);
    const [score, setScore] = useState(0);
    const [inputSequence, setInputSequence] = useState([]);
    const [valid, setValid] = useState(true);

    useEffect(() => {
        resetGame();
    }, []);

    useEffect(() => {
        let timerId;
        switch(gameScreen) {
            case START_SCREEN:
                resetGame();
                break;
            case ROUND_START_SCREEN:
                setRound(prev=>prev+1);
                setTimeout(()=>{
                    setGameScreen(ROUND_SCREEN);
                },2000);
                break;
            case ROUND_SCREEN:
                startRound();
                timerId = setInterval(() => {
                    setTimeRemaining((prevTime) => {
                        if (prevTime <= 0) {
                            clearInterval(timerId);
                            endRound(false);
                            return 0;
                        }
                        return prevTime - stratagemHeroConfig.updateIntervalMs;
                    });
                }, stratagemHeroConfig.updateIntervalMs);
                break;
            case ROUND_END_SCREEN:
                endRound(true);
                setTimeout(()=>{
                    setGameScreen(ROUND_START_SCREEN);
                },3000);
                break;
            case GAME_OVER_SCREEN:
                endRound(false);
                setTimeout(()=>{
                    setGameScreen(START_SCREEN);
                },10000);
                break;
            default:
                break;
        }
        return () => clearInterval(timerId);
    },[gameScreen]);

    const resetGame = () => {
        setTimeRemaining(stratagemHeroConfig.timePerRound * 1000);
        setStratagems([]);
        setStratagemIndex(0);
        setPerfectRoundBonus(stratagemHeroConfig.perfectBonus);
        setRound(0);
        setScore(0);
        setInputSequence([]);
        setValid(true);
    };

    const startRound = () => {
        setInputSequence([]);
        setRoundInProgress(true);
        setTimeRemaining(stratagemHeroConfig.timePerRound * 1000);
        setPerfectRoundBonus(stratagemHeroConfig.perfectBonus);
        setStratagems(getStratagems(round));
        setStratagemIndex(0);
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

    const checkInputSequence = () => {
        const currentStratagem = stratagems[stratagemIndex];
        for (let i = 0; i < inputSequence.length; i++) {
            if (inputSequence[i] !== currentStratagem.code[i]) {
                // Incorrect input, start over on the current combo
                setValid(false);
                setTimeout(() => {
                    setInputSequence([]);
                    setPerfectRoundBonus(0);
                    setValid(true);
                }, stratagemHeroConfig.timeBetweenGems * 1000);
                return;
            }
        }
        // Correct input sequence
        if (inputSequence.length === currentStratagem.code.length) {
            setScore(prevScore => prevScore + currentStratagem.code.length * 5);
            setTimeRemaining(prevTime => Math.min(prevTime + stratagemHeroConfig.timeBonusPerGem * 1000, stratagemHeroConfig.timePerRound * 1000));
            if (stratagemIndex === stratagems.length - 1) {
                // Round completed
                // endRound(true);
                setGameScreen(ROUND_END_SCREEN);
            } else {
                // Move to the next stratagem
                setTimeout(() => {
                    setStratagemIndex((prev) => prev + 1);
                    setInputSequence([]);
                }, stratagemHeroConfig.timeBetweenGems * 1000);
            }
        }
    };


    const endRound = (completed) => {
        if (completed) {
            const newRoundBonus = 50 + round * 25;
            const newTimeBonus = Math.ceil(100 * timeRemaining / (stratagemHeroConfig.timePerRound * 1000));
            const totalBonus = newRoundBonus + newTimeBonus + perfectRoundBonus;
            setRoundBonus(newRoundBonus);
            setTimeBonus(newTimeBonus);
            setScore((prevScore) => prevScore + totalBonus);
            setTimeout(() => {
                setGameScreen(ROUND_START_SCREEN);
            },3000);
        } else {
            setGameScreen(GAME_OVER_SCREEN);
            console.log("Game over! Final score:", score);
        }
    };

    useEffect(() => {
        if (input.direction) {
            switch (gameScreen) {
                case START_SCREEN:
                    setGameScreen(ROUND_START_SCREEN);
                    break;
                case ROUND_SCREEN:
                    setInputSequence(prev => [...prev, input.direction]);
                    break;
                default:
                    break;
            }
        }
    }, [input.direction]);

    useEffect(() => {
        switch (gameScreen) {
            case ROUND_SCREEN:
                if (inputSequence.length > 0) {
                    setValid(true);
                    checkInputSequence();
                }
                break;
            default:
                break;
        }
    }, [inputSequence.length]);

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
        if (gameScreen !== START_SCREEN) return <></>;
        return <Stack justifyContent="center" alignItems="center">
            <Typography variant="h1">
                STRATAGEM HERO
            </Typography>
            <Typography variant="h6">
                Enter any Stratagem Input to Start!
            </Typography>
        </Stack>
    };
    const RoundStartScreen = () => {
        if (gameScreen !== ROUND_START_SCREEN) return <></>;
        return <Stack justifyContent="center" alignItems="center">
            <Typography variant="h1">
                GET READY
            </Typography>
            <Stack justifyContent="center" alignItems="center">
                <Typography variant="h6">Round</Typography>
                <Typography variant="h3">{round}</Typography>
            </Stack>
        </Stack>
    };
    const GameOverScreen = () => {
        if (gameScreen !== GAME_OVER_SCREEN) return <></>;
        return <Stack justifyContent="center" alignItems="center">
            <Typography variant="h1">
                GAME OVER
            </Typography>
            <Stack>
                <Typography variant="h6">Round</Typography>
                <Typography variant="h3">{round}</Typography>
            </Stack>
        </Stack>
    };

    const RoundEndScreen = () => {
        const [show,setShow] = useState(1);

        useEffect(() => {
            setShow(1);
        }, []);

        useEffect(() => {
            if (show < 4) {
                setTimeout(() => {
                    setShow(prev=>prev+1);
                }, 1500);
            }
        }, [show]);

        if (gameScreen !== ROUND_END_SCREEN) return <></>;

        return (<Stack>
            <Stack direction="row" justifyContent="space-between">
                <Typography>
                    Round Bonus
                </Typography>
                <Typography color="yellow">
                    {roundBonus}
                </Typography>
            </Stack>
            { show > 1 &&
                <Stack direction="row" justifyContent="space-between">
                    <Typography>
                        Time Bonus
                    </Typography>
                    <Typography color="yellow">
                        {timeBonus}
                    </Typography>
                </Stack>}
            { show > 2 &&
            <Stack direction="row" justifyContent="space-between">
                <Typography>
                    Perfect Bonus
                </Typography>
                <Typography color="yellow">
                    {perfectRoundBonus}
                </Typography>
            </Stack>}
            { show > 3 &&
            <Stack direction="row" justifyContent="space-between">
                <Typography>
                    Total Score
                </Typography>
                <Typography color="yellow">
                    {score}
                </Typography>
            </Stack>}
        </Stack>
        )
    };

    const RoundScreen = () => {
        if (gameScreen !== ROUND_SCREEN) return <></>;

        return <Box sx={{
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
                {/* <LinearProgress
                    variant='determinate'
                    value={100 * timeRemaining / (stratagemHeroConfig.timePerRound * 1000)}
                    sx={{
                        height: '1rem',
                        mt: '1rem',
                    }}/> */}

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
        </Box>;
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