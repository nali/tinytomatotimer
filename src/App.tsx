import React, { Component } from "react";
import Timer from "./components/Timer";
import { isBeforeInstallPrompt } from "./utils/typeguards";
import "./App.css";

interface State {
  showInstallCTA: boolean;
  deferredPrompt?: Event;
}

class App extends Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      showInstallCTA: false
    };
  }

  componentDidMount() {
    // If we receive an install prompt, stash the event so we can instead show
    // a button in the UI rather than the prompt and avoid disrupting the user flow.
    window.addEventListener("beforeinstallprompt", (e: Event) => {
      e.preventDefault();
      this.setState({
        deferredPrompt: e,
        showInstallCTA: true
      });
    });
  }

  render() {
    return (
      <div className="container">
        {this.state.showInstallCTA && (
          <div onClick={this.onInstall.bind(this)} className="install-cta">
            Add to home screen
          </div>
        )}
        <Timer />
      </div>
    );
  }

  private onInstall() {
    if (
      this.state.deferredPrompt &&
      isBeforeInstallPrompt(this.state.deferredPrompt)
    ) {
      this.state.deferredPrompt.prompt();

      this.setState({
        deferredPrompt: undefined,
        showInstallCTA: false
      });
    }
  }
}

export default App;
