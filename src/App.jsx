import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Game from './Game';
import { ThemeProvider } from '@mui/material';
import theme from './theme';

const App = () => {
  return (<>
    <ThemeProvider theme={theme}>
      <Game />
      <ToastContainer position='bottom-left' />
    </ThemeProvider>
  </>);
};

export default App;
