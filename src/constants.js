import { remote } from "electron";

export const SOCKET_URL = "http://localhost:4000";

export const MOVIE_SEARCH_URL = "http://localhost:5000";

export const DEFAULT_MOVIE_DIR = `${remote.process.env.HOME}/Movies/todo`;

export const MOVIE_INFO_STORAGE_KEY = "movies.library";

export const MOVIE_LIBRARY_PATH_STORAGE_KEY = "movies.path";

export const EVENT_TYPES = {
  getMovies: "library/get",
  setMovies: "library/set",
  watchTrailer: "trailer/watch",
  watchMovie: "movie/watch",
  pauseTrailer: "trailer/pause",
  playTrailer: "trailer/play",
};

export const SUPPORTED_VIDEO_FORMATS = new Set([
  "mp4",
  "m4v",
  "ogg",
  "webm",
  "3gp",
  "mpeg",
  "quicktime",
]);

export const THEME = {
  colors: {
    backgroundPrimary: "#1D0E1E",
    backgroundSecondary: "#2D1C26",
    primary: "#987284",
    secondary: "#6C534E",
  },
  spacing: {
    xSmall: 5,
    small: 10,
    medium: 15,
    large: 24,
    xLarge: 32,
  },
};
