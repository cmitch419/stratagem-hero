import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Game from './components/Game';

const App = () => {
  return (<div className="App">
      <Game />
      <ToastContainer position='bottom-left' />
  </div>);
};

export default App;
