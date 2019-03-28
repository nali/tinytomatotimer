import React, { Component } from "react";
import Timer from "./components/Timer";
import "./App.css";

interface State {
  showInstallCTA: boolean;
}

class App extends Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      showInstallCTA: false
    };
  }

  componentDidMount() {
    let deferredPrompt;

    window.addEventListener("beforeinstallprompt", e => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      deferredPrompt = e;

      this.setState({
        showInstallCTA: true
      });
      console.log("Got prompt");
    });
  }

  render() {
    return (
      <div className="container">
        {this.state.showInstallCTA && (
          <div className="install-cta">Add to home screen</div>
        )}
        <Timer />
      </div>
    );
  }
}

export default App;
