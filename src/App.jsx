import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import stratagemsData from './stratagemsData.json';

const App = () => {
  const [inputSequence, setInputSequence] = useState('');
  const [matchingStratagems, setMatchingStratagems] = useState({});
  const [exactMatch, setExactMatch] = useState(null);
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
        if (exactMatch) {
          toast.success(
            <h4>exactMatch.</h4>
          )
        }
      }
    };
    if (gameInProgress) {
      const handleKeyPress = (event) => {
        event.preventDefault();
        switch (event.key.toLowerCase()) {
          case 'w':
            setInputSequence((prev) => prev + '▲');
            break;
          case 'a':
            setInputSequence((prev) => prev + '◀');
            break;
          case 's':
            setInputSequence((prev) => prev + '▼');
            break;
          case 'd':
            setInputSequence((prev) => prev + '▶');
            break;
          default:
            break;
        }
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
  }, [exactMatch, gameInProgress, inputSequence, matchingStratagems.length]);

  useEffect(() => {
    if (inputSequence && gameInProgress) {
      console.log(inputSequence);
      const checkMatchingStratagems = () => {
        const newMatchingStratagems = {};
        for (const categoryKey in stratagemsData) {
          const category = stratagemsData[categoryKey];
          for (const stratagemKey in category) {
            const stratagem = category[stratagemKey];
            console.log(stratagem.length, inputSequence.length);
            if (stratagem?.join('') === inputSequence) {
              console.log(stratagem);
              setExactMatch({category: categoryKey, stratagem: stratagemKey, arrows: stratagem });
            }
            // if the current input sequence matches the beginning of a stratagem
            if (stratagem?.join('').indexOf(inputSequence) === 0 && stratagem.length >= inputSequence.length) {
              newMatchingStratagems[categoryKey] = { ...newMatchingStratagems[categoryKey], [stratagemKey]: category[stratagemKey] };
            }
          }
        }
        setMatchingStratagems(newMatchingStratagems);
      };
      checkMatchingStratagems();
    }
  }, [gameInProgress, inputSequence]);

  const resetGame = () => {
    setInputSequence('');
    setMatchingStratagems({});
    setShouldReset(false);
    setExactMatch(null);
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
      {Object.entries(stratagemsData).map(([categoryKey, category]) => (
        <div key={categoryKey}>
          <h2>{categoryKey}</h2>
          <ul>
            {Object.entries(category).map(([stratagemKey, arrows]) =>  {
              let isStillValid = matchingStratagems && matchingStratagems[categoryKey] && arrows.join('').indexOf(matchingStratagems[categoryKey][stratagemKey]?.join('')) === 0;
              return (
              <li
                key={stratagemKey}
                className={isStillValid ? 'highlight' : ''}
              >
                <span className="arrow-combo">
                  {arrows?.map((arrow, index) => (
                    <span
                      key={index}
                      className={isStillValid && inputSequence && index < inputSequence.length ? 'matching-arrow' : ''}
                    >
                      {arrow}
                    </span>
                  ))}
                </span>
                <span>
                  {stratagemKey}
                </span>
              </li>
            )})}
          </ul>
        </div>
      ))}
      <ToastContainer />
    </div>
  );
};

export default App;
