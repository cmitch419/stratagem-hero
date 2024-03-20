import { ToastContainer } from 'react-toastify';
import { Box, Typography } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
// import Game from './components/Game';
import BackgroundImage from '/img/console.png'
import StratagemHero from './components/StratagemHero';

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
    m: '13.5% 9.21% 13.5% 9.21%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  }}>

      <StratagemHero />
  </Box>
      {/* <Stratagems /> */}
      {/* <Box position="fixed" right="1rem" bottom="1rem">
        <Typography>Hold SHIFT and press W-A-S-D</Typography>
      </Box>
      <ToastContainer position='bottom-right' /> */}
  </Box>);
};

export default App;
