import React from 'react';
import { Provider as ReduxProvider } from "react-redux";
import Statistics from './WebApp/Statistics';
import { HashRouter as Router, Route } from "react-router-dom";

const App = ({ reduxStore }) => (
  <ReduxProvider store={reduxStore}>
    <Router>
      <Route path="/user/:user" component={({ match }) => (<Statistics user={match.params.user} />)} />
      <Route exact path="/" component={Statistics} />
    </Router>
  </ReduxProvider>
);

export default App;
