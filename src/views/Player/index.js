import fs from "fs";
import React, { useState, useEffect, useContext } from "react";
import { remote } from "electron";
import VideoPlayer from "react-player";
import socketContext from "../../contexts/socket";
import { EVENT_TYPES } from "../../constants";
import styled from "styled-components";
import { updateMovieLibrary, getMovieList, getMoviePath } from "../../library";

const VIDEO_TYPES = {
  youtube: "youtube",
  movie: "movie",
};

function Player() {
  const [nowPlaying, setNowPlaying] = useState(null);
  const [playing, setPlaying] = useState(true);
  const [isLibraryUpdated, setIsLibraryUpdated] = useState(false);
  const socket = useContext(socketContext);

  useEffect(() => {
    updateMovieLibrary().then(setIsLibraryUpdated(true));
  }, []);

  useEffect(() => {
    if (!isLibraryUpdated) {
      return;
    }

    socket.on(EVENT_TYPES.watchTrailer, (movie) => {
      setNowPlaying({
        type: VIDEO_TYPES.youtube,
        src: movie.trailerUrl,
      });
    });

    socket.on(EVENT_TYPES.getMovies, () => {
      socket.emit(EVENT_TYPES.setMovies, getMovieList());
    });

    socket.on(EVENT_TYPES.pauseTrailer, () => {
      setPlaying(false);
    });

    socket.on(EVENT_TYPES.playTrailer, () => {
      setPlaying(true);
    });

    socket.on(EVENT_TYPES.watchMovie, ({ nameOnSystem }) => {
      const file = fs.readFileSync(getMoviePath(nameOnSystem));

      setNowPlaying({
        type: VIDEO_TYPES.video,
        src: URL.createObjectURL(new Blob([file])),
      });
    });

    return () => {
      socket.off(EVENT_TYPES.getMovies);
      socket.off(EVENT_TYPES.watchTrailer);
      socket.off(EVENT_TYPES.pauseTrailer);
      socket.off(EVENT_TYPES.playTrailer);
      socket.off(EVENT_TYPES.watchMovie);
    };
  }, [nowPlaying, socket, isLibraryUpdated]);

  if (!isLibraryUpdated) {
    return <div>Updating library...</div>;
  }

  if (!nowPlaying) {
    return <div>Waiting awkwardly</div>;
  }

  return (
    <Container>
      <VideoPlayerStyled
        width="100%"
        height="100vh"
        url={nowPlaying.src}
        playing={playing}
        onStart={() => remote.getCurrentWindow().setFullScreen(true)}
      />
    </Container>
  );
}

const Container = styled.div`
  background-color: black;
`;

const VideoPlayerStyled = styled(VideoPlayer)`
  border: none;
`;

export default Player;
