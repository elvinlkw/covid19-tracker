import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// File Imports
import Navbar from './components/layout/Navbar';
import Dashboard from './components/dashboard/Dashboard';
import Unsubscribe from './components/unsubscribe/Unsubscribe';
import Subscribe from './components/unsubscribe/Subscribe';
import Alert from './components/layout/Alert';
// Redux
import store from './store';
import { Provider } from 'react-redux';
// CSS
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <div className="container">
          <Alert />
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route path="/unsubscribe" component={Unsubscribe} />
            <Route path="/subscribe" component={Subscribe} />
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
