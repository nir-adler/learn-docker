import logo from './logo.svg';
// import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Page2 from './Page2'
import FibPage from './FibPage'

function App() {
  return (
    <Router>
      <div className="App">
        <header>

          <Link to='/page1'>Page2</Link>
          <span>&nbsp;</span>
          <Link to='/fib'>Fib Page</Link>

        </header>
        <p>devel change </p>
        <Switch>
          <Route path='/page1'>
            <Page2 />
          </Route>
          <Route path='/fib'>
            <FibPage />
          </Route>
        </Switch>
        <p>this is version 2</p>
      </div>

    </Router>
  );
}

export default App;
