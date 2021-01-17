import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// File Imports
import Navbar from './components/layout/Navbar';
import Dashboard from './components/dashboard/Dashboard';
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
          <Switch>
            <Route path="/" component={Dashboard} />
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
