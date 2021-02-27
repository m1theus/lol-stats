import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import Game from './pages/Game';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/game" component={(props) => <Game {...props} />} />
        <Route path="/home" component={(props) => <Home {...props} />} />
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
