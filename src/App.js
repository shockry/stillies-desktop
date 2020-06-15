import React, { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import io from "socket.io-client";
import Player from "./views/Player";
import socketContext from "./contexts/socket";
import { SOCKET_URL, THEME, EVENT_TYPES } from "./constants";

const socket = io(SOCKET_URL);
function App() {
  const [room, setRoom] = useState(null);
  const [isClientConnected, setIsClientConnected] = useState(false);
  socket.on(EVENT_TYPES.roomName, setRoom);
  socket.on(EVENT_TYPES.clientConnected, () => setIsClientConnected(true));

  if (!room) {
    return <StatusText>getting room name</StatusText>;
  }

  if (!isClientConnected) {
    return <StatusText>{"Enter room name: " + room}</StatusText>;
  }

  return (
    <ThemeProvider theme={THEME}>
      <socketContext.Provider value={{ socket, room }}>
        <Player />
      </socketContext.Provider>
    </ThemeProvider>
  );
}

const StatusText = styled.span`
  color: white;
  font-size: 24px;
`;

export default App;
