import React from "react";
import { ThemeProvider } from "styled-components";
import io from "socket.io-client";
import Player from "./views/Player";
import socketContext from "./contexts/socket";
import { SOCKET_URL, THEME } from "./constants";

function App() {
  return (
    <ThemeProvider theme={THEME}>
      <socketContext.Provider value={io(SOCKET_URL)}>
        <Player />
      </socketContext.Provider>
    </ThemeProvider>
  );
}

export default App;
