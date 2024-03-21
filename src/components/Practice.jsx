import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Stratagem from "./Stratagem";
import stratagemsData from "../data/stratagemsData";
import { INPUT_RESET_TIME } from "../constants";
import useGamepad from "../hooks/useGamepad";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import useKeyboard from "../hooks/useKeyboard";
import StratagemDrawer from "./StratagemDrawer";
import StratagemInfo from "./StratagemInfo";

const LAYOUT_SMOL = {
  display: 'grid',
  gridTemplateRows: '4fr 1fr',
  gap: 1,
  gridTemplateColumns: '1fr',
  height: '100vh',
  gridTemplateAreas:
  `"list"
   "info"`
}

const LAYOUT_LARGE = {
  display: 'grid',
  gridTemplateRows: 'auto',
  gap: 1,
  gridTemplateColumns: '2fr 3fr',
  height: '100vh',
  gridTemplateAreas:
  `"list info"`
}

const Practice = () => {
  const theme = useTheme();
  const isBigBoi = useMediaQuery(theme.breakpoints.up('md'));

  const [inputSequence, setInputSequence] = useState('');
  const [matchingStratagems, setMatchingStratagems] = useState([]);
  const [exactMatchIndex, setExactMatchIndex] = useState(-1);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [shouldReset, setShouldReset] = useState(false);
  const [gameInProgress, setGameInProgress] = useState(false);
  const [controllerMode, setControllerMode] = useState(false);
  const [layout, setLayout] = useState(LAYOUT_SMOL);
  const [selectedDrawerIndex,setSelectedDrawerIndex] = useState(0);
  const [activeStratagems,setActiveStratagems] = useState([null,null,null,null]);
  const [activeListView,setActiveListView] = useState(false);

  const gamepad = useGamepad();
  const keyboard = useKeyboard();

  // useEffect(() => {
  //   const n = stratagemsData.length - 1;
  //   const arr = Array.from({ length: n + 1 }, (_, i) => i);
  //   setActiveStratagems(arr);
  //   console.log(arr)
  // },[]);

  useEffect(() => {
    setLayout(isBigBoi ? LAYOUT_LARGE : LAYOUT_SMOL);
  }, [isBigBoi])

  useEffect(() => {
    if (gamepad?.direction) {
      if (!controllerMode) {
        console.debug('Controller mode!');
        setControllerMode(true);
      }
      setInputSequence(prev=>prev + gamepad.direction);
    }
  }, [controllerMode, gamepad.direction]);

  useEffect(() => {
    if (keyboard.direction) {
      if (controllerMode) {
        console.debug('Keyboard mode!');
        setControllerMode(false);
      }
      setInputSequence(prev => prev + keyboard.direction);
    }
  }, [controllerMode, keyboard.direction]);

  useEffect(() => {
    if (!controllerMode) {
      if (keyboard.holdEngaged) {
        setShouldReset(false);
      } else {
        setShouldReset(true);
      }
    }
  }, [controllerMode, keyboard.holdEngaged]);

  useEffect(() => {
    if (inputSequence.length > 0) {
      setGameInProgress(true);
      setShouldReset(false);
      const inputReset = setInterval(() => {
        setShouldReset(true);
      }, INPUT_RESET_TIME * 1000);
      return () => clearInterval(inputReset);
    }

  }, [inputSequence.length]);

  useEffect(() => {
    if (shouldReset) {
      setGameInProgress(false);
      if (exactMatchIndex > -1) {
        toast(stratagemsData[exactMatchIndex].name, { pauseOnFocusLoss: false })
      }
      setInputSequence('');
      console.log('ending');
    }
  }, [exactMatchIndex, shouldReset]);

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

  return (<Box sx={{ ...layout }}>
      <Box sx={{
        gridArea: 'list',
        overflowY: 'scroll',
        backdropFilter: 'blur(1rem)',
        background: 'rgba(0,0,0,0.5)',
        padding: '1rem',
        margin: 0,
      }}>
        <Box component="ul" p={0} m={0}>
          <Box sx={{
            position: "sticky",
            top: 0,
            width: "max-content",
            marginLeft: "auto",
          }} onClick={()=>setActiveListView(!activeListView)}>
            {activeListView ? 'SHOW ALL' : 'SHOW ACTIVE ONLY'}
          </Box>
          {stratagemsData.filter((s,i) => activeListView ? activeStratagems.indexOf(i) > -1 : true).map((stratagem, sgIndex) => {
            const stratagemStr = stratagem?.code?.join('');
            const isStillValid = stratagemStr && stratagemStr.indexOf(inputSequence) === 0;
            const isExactMatch = sgIndex === exactMatchIndex;

            return (
              <li
                key={sgIndex}
                onClick={() => {
                  console.log(sgIndex,activeStratagems)
                  setSelectedIndex(sgIndex)
                  setActiveStratagems(prev=>{
                    prev[selectedDrawerIndex] = sgIndex;
                    return prev;
                  });
                }}
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
        gridArea: 'info',
      }}>
        <Box flex={1} position="fixed" bottom={0}>
          <StratagemDrawer
            stratagems={activeStratagems.map(i=>stratagemsData[i])}
            setSelectedIndex={setSelectedDrawerIndex}
            selectedIndex={selectedDrawerIndex}
          />
        </Box>
        <StratagemInfo stratagem={stratagemsData[selectedIndex]} />
      </Box>
    
    </Box>
  );
}

export default Practice;