import * as React from 'react';
import AppSidebar from './AppSidebar';
import Visualization from "./Visualization";
import './App.css';

// import logo from './logo.svg';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        {/*
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> und save to reload.
        </p>*/
        }
        <Visualization />
        <AppSidebar />
      </div>
    );
  }
}

export default App;
