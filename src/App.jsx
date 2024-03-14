import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import stratagemsData from './stratagemsData.json';

const ALPHA_TO_ARROW = {
  'U': '▲',
  'L': '◀',
  'D': '▼',
  'R': '▶',
};

const KEY_TO_ALPHA = {
  'w': 'U',
  'a': 'L',
  's': 'D',
  'd': 'R',
};

const App = () => {
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
          toast.success(
            <h4>{stratagemsData[exactMatchIndex].name}</h4>
          )
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
        stratagemsData.forEach((stratagem,index) => {
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
    <div className="App">
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
                  <div>
                    <img className="icon" src={`./img/${stratagem.icon}`} />
                    {stratagem?.name}
                  </div>
                  <div className="arrow-combo">
                    {stratagem?.code?.map((alpha, index) => {
                      const arrowClassName = isStillValid
                        ? index + 1 === inputSequence.length
                          ? 'matching-arrow'
                          : 'matched-arrow'
                        : 'invalid-arrow';
                      return (
                      <span key={index} className={arrowClassName}>
                        {ALPHA_TO_ARROW[alpha]}
                      </span>
                    )})}
                  </div>
                </li>
              )
            })}
        </ul>
      <ToastContainer />
    </div>
  );
};

export default App;
