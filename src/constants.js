import { remote } from "electron";

export const SOCKET_URL = "http://localhost:4000";

export const MOVIE_SEARCH_URL = "http://localhost:5000";

export const DEFAULT_MOVIE_DIR = `${remote.process.env.HOME}/Movies/todo`;

export const EVENT_TYPES = {
  watchTrailer: "trailer/watch",
  watchMovie: "movie/watch",
  pauseTrailer: "trailer/pause",
  playTrailer: "trailer/play"
};

export const THEME = {
  colors: {
    backgroundPrimary: "#1D0E1E",
    backgroundSecondary: "#2D1C26",
    primary: "#987284",
    secondary: "#6C534E"
  },
  spacing: {
    xSmall: 5,
    small: 10,
    medium: 15,
    large: 24,
    xLarge: 32
  }
};
