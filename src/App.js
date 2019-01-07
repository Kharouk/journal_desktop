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
          <CodeWindow>
            <AceEditor
              mode="markdown"
              theme="dracula"
              onChange={newContent => {
                this.setState({ text: newContent });
              }}
              name="markdown_editor"
              value={this.state.text}
            />
          </CodeWindow>
          <RenderedWindow>
            <div className="App-div">{this.showContent()}</div>
          </RenderedWindow>
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

const CodeWindow = styled.div`
  flex: 1;
  padding-top: 2rem;
  background-color: #191324;
`;

const RenderedWindow = styled.div`
  background-color: #191324;
  width: 35%;
  padding: 20px;
  color: #fff;
  border-left: 1px solid #302b3a;
  /* prettier-ignore */
  h1, h2, h3, h4, h5, h6 {
    color: #82d8d8;
  }
  h1 {
    border-bottom: solid 3px #e54b4b;
    padding-bottom: 10px;
  }

  a {
    color: #e54b4b;
  }
`;
