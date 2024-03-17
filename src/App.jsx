import { ToastContainer } from 'react-toastify';
import { Box, Typography } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Game from './components/Game';
import BackgroundImage from '/img/bg01.jpg'

const App = () => {
  return (<Box className="App" sx={{
    backgroundImage: `url(${BackgroundImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
  }}>
      <Game />
      {/* <Stratagems /> */}
      <Box position="fixed" right="1rem" bottom="1rem">
        <Typography>Hold SHIFT and press W-A-S-D</Typography>
      </Box>
      <ToastContainer position='bottom-right' />
  </Box>);
};

export default App;
