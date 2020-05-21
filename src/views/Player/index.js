import fs from "fs";
import React, { useState, useEffect, useContext } from "react";
import { remote } from "electron";
import VideoPlayer from "react-player";
import socketContext from "../../contexts/socket";
import { EVENT_TYPES, THEME } from "../../constants";
import styled from "styled-components";
import { updateMovieLibrary, getMovieList, getMoviePath } from "../../library";

const VIDEO_TYPES = {
  youtube: "youtube",
  movie: "movie",
};

const greetings = [
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

const getRandomQuote = () =>
  greetings[Math.floor(Math.random() * greetings.length)];

function Player() {
  const [nowPlaying, setNowPlaying] = useState(null);
  const [playing, setPlaying] = useState(true);
  const [isLibraryUpdated, setIsLibraryUpdated] = useState(false);
  const [greeting, setGreeting] = useState(getRandomQuote());
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

  useEffect(() => {
    if (!nowPlaying) {
      const interval = setInterval(() => {
        setGreeting(getRandomQuote());
      }, 10000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [nowPlaying]);

  if (!isLibraryUpdated) {
    return (
      <Container>
        <StatusText>Updating library...</StatusText>
      </Container>
    );
  }

  if (!nowPlaying) {
    return (
      <Container>
        <StatusText>Waiting awkwardly</StatusText>
        {greeting}
      </Container>
    );
  }

  return (
    <PlayerContainer>
      <VideoPlayerStyled
        width="100%"
        height="100vh"
        url={nowPlaying.src}
        playing={playing}
        onStart={() => remote.getCurrentWindow().setFullScreen(true)}
      />
    </PlayerContainer>
  );
}

const Container = styled.div`
  background-color: ${THEME.colors.backgroundPrimary};
  color: ${THEME.colors.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const StatusText = styled.span`
  font-size: 10rem;
`;

const PlayerContainer = styled.div`
  background-color: black;
`;

const VideoPlayerStyled = styled(VideoPlayer)`
  border: none;
`;

export default Player;
