import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
//sss
import OtherPage from './OtherPage'
import Fib from './Fib'


//ssss
function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Link to='/'>Home</Link>
          <Link to='/otherpage'>Other page</Link>
        </header>

        <div>
          <Route exact path='/' component={Fib} />
          <Route path='/otherpage' component={OtherPage} />
        </div>

      </div>
    </Router>
  );
}

export default App;
