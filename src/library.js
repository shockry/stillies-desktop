import fs from "fs";
import path from "path";
import Store from "electron-store";
import {
  DEFAULT_MOVIE_DIR,
  MOVIE_SEARCH_URL,
  MOVIE_INFO_STORAGE_KEY,
  SUPPORTED_VIDEO_FORMATS,
} from "./constants";

function getMovieNames(directory) {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(
        files
          .filter((fileName) => !fileName.startsWith("."))
          .map(async (fileName) => {
            const isDirectory = fs
              .statSync(path.join(directory, fileName))
              .isDirectory();

            if (isDirectory) {
              const movieDetailsPromise = await getMovieNames(
                path.join(directory, fileName)
              );

              const allFileDetails = await Promise.all(movieDetailsPromise);

              const movieDetails = allFileDetails.find((fileDetail) => {
                const extension = fileDetail.nameOnSystem.split(".")[1];
                return SUPPORTED_VIDEO_FORMATS.has(extension.toLowerCase());
              });

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
          })
      );
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
  const moviesOnFileSystemPromises = await getMovieNames(DEFAULT_MOVIE_DIR);
  const moviesOnFileSystem = await Promise.all(moviesOnFileSystemPromises);

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
}

export function getMovieList() {
  const store = new Store();
  return store.get(MOVIE_INFO_STORAGE_KEY);
}

export const getMoviePath = (nameOnSystem) =>
  `${DEFAULT_MOVIE_DIR}/${nameOnSystem}`;
