import React, { Component } from "react";
import Markdown from "markdown-to-jsx";
import AceEditor from "react-ace";
import styled from "styled-components";
import brace from "brace";
import "brace/mode/markdown";
import "brace/theme/dracula";
import "./App.css";
// have to use the window.require (related to the build we are using) and the older require method
const { ipcRenderer } = window.require("electron");

class App extends Component {
  constructor() {
    super();

    this.state = {
      text: ""
    };

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
        <Split>
          <AceEditor
            mode="markdown"
            theme="dracula"
            onChange={newContent => {
              this.setState({ text: newContent });
            }}
            name="markdown_editor"
            value={this.state.text}
          />
          <div className="App-div">{this.showContent()}</div>
        </Split>
      </div>
    );
  }
}

export default App;

const Split = styled.div`
  display: flex;
  height: 100vh;
`;
