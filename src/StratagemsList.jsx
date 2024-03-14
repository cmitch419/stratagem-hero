// StratagemsList.js
import React from 'react';
import stratagemsData from './stratagemsData.json';

const arrowSymbolsMap = {
  '▼': 'dpad down',
  '▲': 'dpad up',
  '◀': 'dpad left',
  '▶': 'dpad right'
};

const StratagemsList = ({ inputMode, currentDPadDirection }) => {
  return (
    <div>
      <h1>Stratagem Combinations</h1>
      <ul>
        {Object.keys(stratagemsData).map(category => (
          <li key={category}>
            <strong>{category}</strong>
            <ul>
              {Object.keys(stratagemsData[category]).map(stratagem => (
                <li key={stratagem}>
                  <span>{stratagem}</span>
                  <span>{stratagemsData[category][stratagem].split('').map((symbol, index) => (
                    <span key={index} style={{ color: currentDPadDirection && inputMode === 'controller' && index < currentDPadDirection.length && currentDPadDirection[index] === arrowSymbolsMap[symbol] ? 'green' : 'black' }}>{symbol}</span>
                  ))}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StratagemsList;
