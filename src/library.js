import fs from "fs";
import path from "path";
import Store from "electron-store";
import {
  DEFAULT_MOVIE_DIR,
  MOVIE_SEARCH_URL,
  MOVIE_INFO_STORAGE_KEY,
  MOVIE_LIBRARY_PATH_STORAGE_KEY,
  SUPPORTED_VIDEO_FORMATS,
} from "./constants";

function getMovieNames(directory) {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, async (err, directoryContents) => {
      if (err) {
        reject(err);
        return;
      }

      const moviesPromises = directoryContents
        .filter((fileName) => {
          // Keep only videos and non-hidden files and folders
          const extension = fileName.split(".")[1];
          return (
            !fileName.startsWith(".") &&
            (!extension || SUPPORTED_VIDEO_FORMATS.has(extension.toLowerCase()))
          );
        })
        .map(async (fileName) => {
          const isDirectory = fs
            .statSync(path.join(directory, fileName))
            .isDirectory();

          if (isDirectory) {
            const fileDetails = await getMovieNames(
              path.join(directory, fileName)
            );

            const movieDetails = fileDetails[0];

            if (!movieDetails) {
              return null;
            }

            return {
              ...movieDetails,
              nameOnSystem: path.join(
                movieDetails.title,
                movieDetails.nameOnSystem
              ),
            };
          }

          return {
            title: fileName.slice(0, fileName.lastIndexOf(".")),
            nameOnSystem: fileName, //Keep extension
          };
        });

      const moviesOnSystem = await Promise.all(moviesPromises);
      resolve(moviesOnSystem.filter(Boolean));
    });
  });
}

async function getMovieInfo({ title, nameOnSystem }) {
  const movieInfo = await fetch(
    `${MOVIE_SEARCH_URL}/search/${title}`
  ).then((res) => res.json());

  return {
    ...movieInfo,
    nameOnSystem,
  };
}

export async function updateMovieLibrary() {
  const store = new Store();
  const existingMovies = store.get(MOVIE_INFO_STORAGE_KEY) || [];
  const moviesOnFileSystem = await getMovieNames(getMovieLibraryPath());

  const newMovies = await Promise.all(
    moviesOnFileSystem
      .filter(
        (movieOnSystem) =>
          !existingMovies.find((movie) => movie.title === movieOnSystem.title)
      )
      .map((movieToFetch) => getMovieInfo(movieToFetch))
  );

  const movieList = [...existingMovies, ...newMovies];

  store.set(MOVIE_INFO_STORAGE_KEY, movieList);

  return movieList;
}

export const getMoviePath = (nameOnSystem) =>
  `${DEFAULT_MOVIE_DIR}/${nameOnSystem}`;

export function getMovieLibraryPath() {
  const store = new Store();
  return store.get(MOVIE_LIBRARY_PATH_STORAGE_KEY) || DEFAULT_MOVIE_DIR;
}

export function setMovieLibraryPath(newPath) {
  if (newPath) {
    const store = new Store();
    return store.set(MOVIE_LIBRARY_PATH_STORAGE_KEY, newPath);
  }
}

export function clearLibrary() {
  const store = new Store();
  store.delete(MOVIE_INFO_STORAGE_KEY);
}
