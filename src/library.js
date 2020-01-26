import fs from "fs";
import { DEFAULT_MOVIE_DIR, MOVIE_SEARCH_URL } from "./constants";

function getMovieNames(directory) {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(
        files.map(fileName => fileName.slice(0, fileName.lastIndexOf(".")))
      );
    });
  });
}

const getMovieInfo = movieName =>
  fetch(`${MOVIE_SEARCH_URL}/search/${movieName}`).then(res => res.json());

export async function getMovieList() {
  const movieNames = await getMovieNames(DEFAULT_MOVIE_DIR);
  const movieInfo = await Promise.all(movieNames.map(getMovieInfo));
  console.log(movieInfo);
}

export const movieList = [
  {
    title: "Gravity",
    description: "People floating in space and stuff",
    duration: "like 3 hours or something",
    poster: "http://www.movienewsletters.net/photos/120638R1.jpg"
  },
  {
    title: "Split",
    description: "A person having multiple personalities, etc.",
    duration: "120 mins.",
    poster:
      "https://images-na.ssl-images-amazon.com/images/I/91bMWp2+xOL._RI_.jpg"
  },
  {
    title: "Game night",
    trailerUrl: "https://www.youtube.com/watch?v=-76o69txkZs",
    movieUrl: "http://localhost:3030/Game%20Night.m4v",
    description:
      "A group of friends go into a gaming night that went wrong, also funny",
    duration: "120 mins.",
    poster:
      "https://images-na.ssl-images-amazon.com/images/I/811EftxWNdL._SL1500_.jpg"
  },
  {
    title: "CATS!",
    description: "People who are also cats. Oh god..",
    duration: "109 mins.",
    poster:
      "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRd7hflmKmcFJYnNEQUDwIp0NoG7eGmz_9NtLf18oX_lroCODr6"
  }
];
