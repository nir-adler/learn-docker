import './App.css';
import Fib from './Fib'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <nav>
          <Link to='/'>Home</Link>
          &nbsp;	&nbsp;
          <Link to='/fib'>Fib</Link>
        </nav>
       
      </div>
      <div>
        <Switch>
          <Route path="/fib">
            <Fib />
          </Route>

        </Switch>
      </div>
    </Router>
  );
}

export default App;
