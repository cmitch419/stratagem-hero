import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Stratagem, { StratagemInfo, StratagemLine } from "./Stratagem";
import stratagemsData from "../data/stratagemsData.json";
import { KEY_TO_ALPHA } from "../constants";
import useGamepad from "../hooks/useGamepad";
import { Box, Stack } from "@mui/material";

const Game = () => {
  const [inputSequence, setInputSequence] = useState('');
  const [matchingStratagems, setMatchingStratagems] = useState([]);
  const [exactMatchIndex, setExactMatchIndex] = useState(-1);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [shouldReset, setShouldReset] = useState(false);
  const [gameInProgress, setGameInProgress] = useState(false);

  const gamepads = useGamepad();

  useEffect(() => {
    if (gamepads) {
      console.log('GAMEPAD CONNECTED! ', gamepads);
    } else {
      console.log('GAMEPAD DISCONNECTED!');
    }
  }, [gamepads])

  useEffect(() => {
    const handleShiftKeyDown = (event) => {
      if (event.key === 'Shift') {
        event.preventDefault();
        resetGame();
        setGameInProgress(true);
      }
    };
    const handleShiftKeyUp = (event) => {
      if (!event.shiftKey && event.key === 'Shift') {
        event.preventDefault();
        setGameInProgress(false);
        if (exactMatchIndex > -1) {
          toast(<Stratagem stratagem={stratagemsData[exactMatchIndex]} />, { pauseOnFocusLoss: false, autoClose: stratagemsData[exactMatchIndex].cooldown * 1000 })
        }
      }
    };
    if (gameInProgress) {
      const handleKeyPress = (event) => {
        event.preventDefault();
        const alpha = KEY_TO_ALPHA[event.key.toLowerCase()];
        alpha && setInputSequence((prev) => prev + alpha);
      };

      console.log('game started, recording input');
      window.addEventListener('keyup', handleShiftKeyUp);
      window.addEventListener('keypress', handleKeyPress);

      return () => {
        console.debug('removing Shift keyup and keypress');
        window.removeEventListener('keyup', handleShiftKeyUp);
        window.removeEventListener('keypress', handleKeyPress);
      };

    } else {
      console.log('game ending');
      setShouldReset(true);
      window.addEventListener('keydown', handleShiftKeyDown);
      return () => {
        window.removeEventListener('keydown', handleShiftKeyDown);
      };

    }
  }, [exactMatchIndex, gameInProgress, inputSequence, matchingStratagems.length]);

  useEffect(() => {
    if (inputSequence && gameInProgress) {
      const checkMatchingStratagems = () => {
        let newMatchingStratagems = [];
        stratagemsData.forEach((stratagem, index) => {
          const stratagemStr = stratagem?.code?.join('');
          if (stratagemStr === inputSequence) {
            setExactMatchIndex(index);
          }
          // if the current input sequence matches the beginning of a stratagem
          if (stratagemStr.indexOf(inputSequence) === 0 && stratagemStr.length >= inputSequence.length) {
            newMatchingStratagems.push(index);
          }
        });
        setMatchingStratagems(newMatchingStratagems);
      };
      checkMatchingStratagems();
    }
  }, [gameInProgress, inputSequence]);

  const resetGame = () => {
    setInputSequence('');
    setMatchingStratagems([]);
    setShouldReset(false);
    setExactMatchIndex(-1);
    setGameInProgress(false);
    console.log('Game reset!');
  };

  useEffect(() => {
    const resetTime = 2;
    if (shouldReset) {
      console.debug(`Resetting game in ${resetTime} seconds`);
      const reset = setInterval(() => {
        resetGame();
      }, resetTime * 1000);
      return () => clearInterval(reset);
    }
  }, [shouldReset]);

  return (
    <Stack direction="row" justifyContent="space-between">
      <Box>
        <Box component="ul">
          {stratagemsData?.map((stratagem, sgIndex) => {
            const stratagemStr = stratagem?.code?.join('');
            const isStillValid = stratagemStr && stratagemStr.indexOf(inputSequence) === 0;
            const isExactMatch = sgIndex === exactMatchIndex;

            return (
              <li
                key={sgIndex}
                onClick={() => setSelectedIndex(sgIndex)}
              >
                <Stratagem
                  inputSequence={inputSequence}
                  stratagem={stratagem}
                  valid={isStillValid}
                  key={sgIndex}
                  matched={isExactMatch}
                />
              </li>
            )
          })}
        </Box>
      </Box>
      <Box sx={{
        position: 'fixed',
        right: 0,
        marginRight: '1rem',
        marginTop: '1rem',
        width: '50%'
      }}>
        <StratagemInfo stratagem={stratagemsData[selectedIndex]} />
      </Box>
    </Stack>
  );
}

export default Game;