import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Bot } from './Bot';
import Login from './Components/LoginModal';
import Rigister from './Components/SignupModal';


function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route path="/signup" component={Rigister}></Route>
          <Route path="/login" component={Login}></Route>
          <Route path="/home" component={Bot}></Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
