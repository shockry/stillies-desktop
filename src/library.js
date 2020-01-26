import fs from "fs";
import Store from "electron-store";
import {
  DEFAULT_MOVIE_DIR,
  MOVIE_SEARCH_URL,
  MOVIE_INFO_STORAGE_KEY
} from "./constants";

function getMovieNames(directory) {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(
        files.map(fileName => {
          return {
            title: fileName.slice(0, fileName.lastIndexOf(".")),
            nameOnSystem: fileName
          };
        })
      );
    });
  });
}

async function getMovieInfo({ title, nameOnSystem }) {
  const movieInfo = await fetch(
    `${MOVIE_SEARCH_URL}/search/${title}`
  ).then(res => res.json());

  return {
    ...movieInfo,
    nameOnSystem
  };
}

export async function updateMovieLibrary() {
  const store = new Store();
  const existingMovies = store.get(MOVIE_INFO_STORAGE_KEY) || [];
  const moviesOnFileSystem = await getMovieNames(DEFAULT_MOVIE_DIR);

  const newMovies = await Promise.all(
    moviesOnFileSystem
      .filter(
        movieOnSystem =>
          !existingMovies.find(movie => movie.title === movieOnSystem.title)
      )
      .map(movieToFetch => getMovieInfo(movieToFetch))
  );

  const movieList = [...existingMovies, ...newMovies];

  store.set(MOVIE_INFO_STORAGE_KEY, movieList);
}

export function getMovieList() {
  const store = new Store();
  return store.get(MOVIE_INFO_STORAGE_KEY);
}

export const getMoviePath = nameOnSystem =>
  `${DEFAULT_MOVIE_DIR}/${nameOnSystem}`;
