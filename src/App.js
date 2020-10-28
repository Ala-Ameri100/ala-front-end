import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Bot } from './Bot';

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route component={Bot}></Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
