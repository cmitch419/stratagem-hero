import { ToastContainer } from 'react-toastify';
import { Box, Typography } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
// import Game from './components/Game';
import BackgroundImage from '/img/console.png'
import StratagemHero from './components/StratagemHero';
import OnScreenDpad from './components/OnScreenButtons';

const App = () => {
  return (<Box className="App" sx={{
    backgroundImage: `url(${BackgroundImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100vw',
    height: '48.2vw',
    display: 'flex',
    overflow: 'hidden',
    // backgroundColor: '#292929',
  }}><Box sx={{
    // m: '13.5% 9.21% 13.5% 9.21%',
    m: '13.5% 11.21% 13.5% 11.21%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    transform: 'scale(100%)'
  }}>
      <StratagemHero />
    </Box>
    <Box sx={{
      display: 'flex',
      position: 'fixed',
      left: 0,
      bottom: 0,
      zIndex: 10000,
      alignContent: 'center',
      justifyContent: 'center',
      transform: 'scale(200%) translate(50%,-50%)'
    }}>
      <OnScreenDpad />
    </Box>
    {/* <Stratagems /> */}
    {/* <Box position="fixed" right="1rem" bottom="1rem">
        <Typography>Hold SHIFT and press W-A-S-D</Typography>
      </Box>
      <ToastContainer position='bottom-right' /> */}
  </Box>);
};

export default App;
