import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Stratagem, { StratagemInfo } from "./components/Stratagem";
import stratagemsData from "./stratagemsData.json";
import { KEY_TO_ALPHA } from "./constants";

const Game = () => {
    const [inputSequence, setInputSequence] = useState('');
    const [matchingStratagems, setMatchingStratagems] = useState([]);
    const [exactMatchIndex, setExactMatchIndex] = useState(-1);
    const [shouldReset, setShouldReset] = useState(false);
    const [gameInProgress, setGameInProgress] = useState(false);
  
    useEffect(() => {
      const handleShiftKeyDown = (event) => {
        event.preventDefault();
        if (event.key === 'Shift') {
          resetGame();
          setGameInProgress(true);
        }
      };
      const handleShiftKeyUp = (event) => {
        event.preventDefault();
        if (!event.shiftKey && event.key === 'Shift') {
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
        <ul>
          {stratagemsData?.map((stratagem, sgIndex) => {
            const stratagemStr = stratagem?.code?.join('');
            const isStillValid = stratagemStr && inputSequence.length > 0 && stratagemStr.indexOf(inputSequence) === 0 && inputSequence.length <= stratagemStr.length;
            const isExactMatch = sgIndex === exactMatchIndex;

            return (
              <li
                key={stratagem.name}
                className={`${isStillValid ? 'highlight' : ''} ${isExactMatch ? 'exact-match' : ''}`}
              >
                <StratagemInfo stratagem={stratagem} />
                <Stratagem
                  inputSequence={inputSequence}
                  stratagem={stratagem}
                  isStillValid={isStillValid}
                  key={stratagem.name}
                />
              </li>
            )
          })}
        </ul>);
}

export default Game;