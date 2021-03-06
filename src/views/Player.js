import React, { useState, useEffect, useContext, useCallback } from "react";
import { remote } from "electron";
import VideoPlayer from "react-player";
import styled from "styled-components";
import socketContext from "../contexts/socket";
import { EVENT_TYPES, GREETINGS } from "../constants";
import * as library from "../helpers/library";
import { getMovieUrl } from "../helpers/mediaServer";

const VIDEO_TYPES = {
  youtube: "youtube",
  movie: "movie",
};

const getRandomGreeting = () =>
  GREETINGS[Math.floor(Math.random() * GREETINGS.length)];

function Player() {
  const [nowPlaying, setNowPlaying] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [movies, setMovies] = useState([]);
  const [greeting, setGreeting] = useState(getRandomGreeting());
  const [libraryPath, setLibraryPath] = useState(library.getMovieLibraryPath());

  const { socket, room } = useContext(socketContext);

  const updateLibrary = useCallback(
    ({ force } = { force: false }) => {
      library.updateMovieLibrary(force).then((movies) => {
        setMovies(movies);
        socket.emit(EVENT_TYPES.setMovies, movies, room);
      });
    },
    [room, socket]
  );

  useEffect(() => {
    updateLibrary();
  }, [libraryPath, updateLibrary]);

  useEffect(() => {
    socket.on(EVENT_TYPES.getMovies, () => {
      socket.emit(EVENT_TYPES.setMovies, movies, room);
    });

    socket.on(EVENT_TYPES.watchTrailer, (movie) => {
      setNowPlaying({
        type: VIDEO_TYPES.youtube,
        src: movie.trailerUrl,
      });
      setIsPlaying(true);
    });

    socket.on(EVENT_TYPES.watchMovie, ({ nameOnSystem }) => {
      const file = getMovieUrl(nameOnSystem);
      setNowPlaying({
        type: VIDEO_TYPES.video,
        src: file,
      });
      setIsPlaying(true);
    });

    socket.on(EVENT_TYPES.play, () => {
      setIsPlaying(true);
    });

    socket.on(EVENT_TYPES.pause, () => {
      setIsPlaying(false);
    });

    return () => {
      socket.off(EVENT_TYPES.getMovies);
      socket.off(EVENT_TYPES.watchTrailer);
      socket.off(EVENT_TYPES.watchMovie);
      socket.off(EVENT_TYPES.play);
      socket.off(EVENT_TYPES.pause);
    };
  }, [movies, nowPlaying, room, socket]);

  useEffect(() => {
    if (!nowPlaying) {
      const interval = setInterval(() => {
        setGreeting(getRandomGreeting());
      }, 10000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [nowPlaying]);

  if (movies.length === 0) {
    return (
      <Container>
        <StatusText>Updating library...</StatusText>
      </Container>
    );
  }

  if (!nowPlaying) {
    return (
      <Container>
        <LibraryPathContainer>
          Your movies are checked at {libraryPath}
          <Button
            onClick={() => {
              const newPath = remote.dialog.showOpenDialogSync({
                browserWindow: remote.getCurrentWindow(),
                defaultPath: libraryPath,
                properties: ["openDirectory"],
              });
              if (newPath) {
                library.clearLibrary();
                library.setMovieLibraryPath(newPath[0]);
                setMovies([]);
                setLibraryPath(newPath[0]);
              }
            }}
          >
            Change
          </Button>
          <Button
            onClick={() => {
              setMovies([]);
              updateLibrary({ force: true });
            }}
          >
            Refresh library
          </Button>
        </LibraryPathContainer>
        <StatusText>Waiting awkwardly</StatusText>
        <Greeting>{greeting}</Greeting>
      </Container>
    );
  }

  return (
    <PlayerContainer>
      <VideoPlayerStyled
        width="100%"
        height="100vh"
        url={nowPlaying.src}
        playing={isPlaying}
        onStart={() => remote.getCurrentWindow().setFullScreen(true)}
      />
    </PlayerContainer>
  );
}

const Container = styled.div`
  background-color: ${(props) => props.theme.colors.backgroundPrimary};
  color: ${(props) => props.theme.colors.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const StatusText = styled.span`
  font-size: 5rem;
  @media (max-width: 621px) {
    font-size: 3rem;
  }
`;

const LibraryPathContainer = styled.span`
  position: absolute;
  top: ${(props) => props.theme.spacing.medium}px;
  left: ${(props) => props.theme.spacing.medium}px;
`;

const Button = styled.button`
  background-color: #987284;
  border: none;
  color: #1d0e1e;
  margin-left: ${(props) => props.theme.spacing.small}px;
`;

const PlayerContainer = styled.div`
  background-color: black;
`;

const VideoPlayerStyled = styled(VideoPlayer)`
  border: none;
`;

const Greeting = styled.span`
  margin-top: ${(props) => props.theme.spacing.small}px;
`;

export default Player;
