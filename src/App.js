import React, { Component } from "react";
import "./App.css";
// have to use the window.require (related to the build we are using) and the older require method
const { ipcRenderer } = window.require("electron");

class App extends Component {
  constructor() {
    super();

    this.state = {
      text: null
    };

    ipcRenderer.on("new-file", (event, fileContent) => {
      this.setState({ text: fileContent });
    });
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Welcome to your ultimate <code>Journal</code>.
          </p>
          <p>{this.state.text}</p>
        </header>
      </div>
    );
  }
}

export default App;
