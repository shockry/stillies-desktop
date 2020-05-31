import { remote } from "electron";

export const SOCKET_URL = "http://localhost:4000";

export const MOVIE_API_URL = "http://localhost:5000";

export const DEFAULT_MOVIE_LIBRARY_PATH = `${remote.process.env.HOME}/Movies/todo`;

export const MOVIE_INFO_STORAGE_KEY = "movies.library";

export const MOVIE_LIBRARY_PATH_STORAGE_KEY = "movies.path";

export const EVENT_TYPES = {
  getMovies: "library/get",
  setMovies: "library/set",
  watchTrailer: "trailer/watch",
  watchMovie: "movie/watch",
  play: "play",
  pause: "pause",
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

export const GREETINGS = [
  "Hello there",
  "So uh, how was your day",
  "Wanna watch a movie, eh?",
  "On your mark",
  "Roses are red, violets are blue, I will play a movie if you ask me to",
  "To the infinity and beyond",
  "Cats",
  "At the end of the day, we sleep",
  "I can wait here all day",
];
