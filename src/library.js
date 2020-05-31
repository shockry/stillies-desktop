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

function getMovieNamesOnSystem(directory) {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, async (error, directoryContents) => {
      if (error) {
        reject(error);
        return;
      }

      const moviesPromises = directoryContents
        .filter((fileName) => {
          // Keep only videos and non-hidden files and folders
          // No extension is assumed to be a folder
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
            const moviesInDirectory = await getMovieNamesOnSystem(
              path.join(directory, fileName)
            );

            if (!moviesInDirectory) {
              return null;
            }

            return moviesInDirectory.map((movieDetail) => ({
              ...movieDetail,
              nameOnSystem: path.join(fileName, movieDetail.nameOnSystem),
            }));
          }

          return {
            title: fileName.slice(0, fileName.lastIndexOf(".")),
            nameOnSystem: fileName, //Keep extension
          };
        });

      try {
        const allMovies = await Promise.all(moviesPromises);
        const moviesOnSystem = allMovies.filter(Boolean);
        resolve(moviesOnSystem.flat());
      } catch (error) {
        reject(error);
      }
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
  const moviesOnFileSystem = await getMovieNamesOnSystem(getMovieLibraryPath());

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
