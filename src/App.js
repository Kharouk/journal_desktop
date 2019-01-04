import React, { Component } from "react";
import Markdown from "markdown-to-jsx";
import "./App.css";
// have to use the window.require (related to the build we are using) and the older require method
const { ipcRenderer } = window.require("electron");

class App extends Component {
  constructor() {
    super();

    this.state = {
      text: ""
    };

    /*
     **
     ** {TODO: install markdown-to-jsx file}
     **
     */

    ipcRenderer.on("new-file", (event, fileContent) => {
      this.setState({ text: fileContent });
    });
  }

  showContent = () => {
    if (this.state.text.length > 0) {
      return <Markdown>{this.state.text}</Markdown>;
    } else {
      return (
        <>
          <h1>
            Welcome to your ultimate <code>Journal</code>.
          </h1>
          <p>Open a file or Directory.</p>
        </>
      );
    }
  };
  render() {
    return (
      <div className="App">
        <header className="App-header">{this.showContent()}</header>
      </div>
    );
  }
}

export default App;
