import { ToastContainer } from 'react-toastify';
import { Box } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Game from './components/Game';
import BackgroundImage from '../public/img/bg01.jpg'

const App = () => {
  return (<Box component="div" className="App" sx={{
    backgroundImage: `url(${BackgroundImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
  }}>
      <Game />
      <ToastContainer position='bottom-left' />
  </Box>);
};

export default App;
