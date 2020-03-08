import React, { Component } from "react";
import Timer from "./components/Timer";
import "./App.css";

interface State {
  showInstallCTA: boolean;
  deferredPrompt?: Event;
}

function isBeforeInstallPrompt(
  event: Event
): event is BeforeInstallPromptEvent {
  return "userChoice" in event;
}

class App extends Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      showInstallCTA: false
    };
  }

  componentDidMount() {
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
    // Show the install prompt
    if (
      this.state.deferredPrompt &&
      isBeforeInstallPrompt(this.state.deferredPrompt)
    ) {
      this.state.deferredPrompt.prompt();
    }

    this.setState({
      deferredPrompt: undefined,
      showInstallCTA: false
    });
  }
}

export default App;
