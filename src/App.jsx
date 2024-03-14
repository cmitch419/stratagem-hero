import { useState, useEffect } from 'react';
import './App.css';
import stratagemsData from './stratagemsData.json';

const defaultState = {
  inputSequence: '',
  matchingStratagem: null,
  stillValidStratagems: stratagemsData,
  shouldReset: false,
  gameInProgress: false,
};

const App = () => {
  const [inputSequence, setInputSequence] = useState(defaultState.inputSequence);
  const [matchingStratagem, setMatchingStratagem] = useState(defaultState.matchingStratagem);
  const [stillValidStratagems, setStillValidStratagems] = useState(defaultState.stillValidStratagems);
  const [shouldReset, setShouldReset] = useState(defaultState.shouldReset);
  const [gameInProgress, setGameInProgress] = useState(defaultState.gameInProgress);
  
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
        console.debug(stillValidStratagems);
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
      
      console.debug('game started, recording input');
      window.addEventListener('keyup', handleShiftKeyUp);
      window.addEventListener('keypress', handleKeyPress);
      
      return () => {
        console.debug('removing Shift keyup and keypress');
        window.removeEventListener('keyup', handleShiftKeyUp);
        window.removeEventListener('keypress', handleKeyPress);
      };

    } else {
      console.debug('game ending');
      setShouldReset(true);
      window.addEventListener('keydown', handleShiftKeyDown);
      return () => {
        window.removeEventListener('keydown', handleShiftKeyDown);
      };
      
    }
  }, [gameInProgress, stillValidStratagems]);

  useEffect(() => {
    if (inputSequence) {
      console.debug(inputSequence);
      const checkMatchingStratagem = () => {
        const newValidGems = stillValidStratagems;
        for (const categoryKey in newValidGems) {
          const category = newValidGems[categoryKey];
          for (const stratagemKey in category) {
            const stratagem = category[stratagemKey];
            if (stratagem.join('') === inputSequence) {
              setMatchingStratagem({ category: categoryKey, stratagem: stratagemKey });
              setStillValidStratagems({ [categoryKey]: { [stratagemKey]: stratagemsData[categoryKey][stratagemKey]} });
              return;
            }
            if (stratagem.join('').indexOf(inputSequence) === 0) {
              newValidGems[categoryKey][stratagemKey] = stratagemsData[categoryKey][stratagemKey];
            }
          }
        }
        setMatchingStratagem(null);
        setStillValidStratagems(newValidGems);
      };
      checkMatchingStratagem();
    }
  }, [gameInProgress, inputSequence, stillValidStratagems]);

  const resetGame = () => {
    setInputSequence(defaultState.inputSequence);
    setMatchingStratagem(defaultState.matchingStratagem);
    setStillValidStratagems(defaultState.stillValidStratagems);
    setShouldReset(defaultState.shouldReset);
    setGameInProgress(defaultState.gameInProgress);
    console.debug('Game reset!');
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
            {Object.entries(category).map(([stratagemKey, arrows]) => (
              <li
                key={stratagemKey}
                className={matchingStratagem && matchingStratagem.stratagem === stratagemKey ? 'highlight' : ''}
              >
                {stratagemKey}
                <span className="arrow-combo">
                  {arrows.map((arrow, index) => (
                    <span
                      key={index}
                      className={inputSequence[index] && inputSequence[index] === arrow ? 'matching-arrow' : ''}
                    >
                      {arrow}
                    </span>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {/* Toast notification for finalized stratagem */}
      {matchingStratagem && (
        <div className="toast-notification">
          Finalized Stratagem: {matchingStratagem.stratagem} (Category: {matchingStratagem.category})
        </div>
      )}
    </div>
  );
};

export default App;
