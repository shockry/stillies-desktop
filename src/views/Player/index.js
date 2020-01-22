import React, { useState, useEffect, useContext, useRef } from "react";
import VideoPlayer from "react-player";
import screenfull from "screenfull";
import socketContext from "../../contexts/socket";
import { EVENT_TYPES } from "../../constants";
import styled from "styled-components";
import { findDOMNode } from "react-dom";

const VIDEO_TYPES = {
  youtube: "youtube",
  movie: "movie"
};

function Player() {
  const [nowPlaying, setNowPlaying] = useState(null);
  const [playing, setPlaying] = useState(true);
  const socket = useContext(socketContext);
  const player = useRef();

  useEffect(() => {
    socket.on(EVENT_TYPES.watchTrailer, movie => {
      setNowPlaying({
        type: VIDEO_TYPES.youtube,
        src: movie.trailerUrl
      });
    });

    socket.on(EVENT_TYPES.pauseTrailer, () => {
      setPlaying(false);
    });

    socket.on(EVENT_TYPES.playTrailer, () => {
      setPlaying(true);
    });

    socket.on(EVENT_TYPES.watchMovie, movie => {
      setNowPlaying({
        type: VIDEO_TYPES.video,
        src: movie.movieUrl
      });
    });

    return () => {
      socket.off(EVENT_TYPES.watchTrailer);
      socket.off(EVENT_TYPES.pauseTrailer);
      socket.off(EVENT_TYPES.playTrailer);
      socket.off(EVENT_TYPES.watchMovie);
    };
  }, [nowPlaying, socket]);

  if (!nowPlaying) {
    return <div>Waiting awkwardly</div>;
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <button
        onClick={() =>
          screenfull.request(findDOMNode(player.current)).catch(console.log)
        }
      >
        full
      </button>
      {nowPlaying.type === VIDEO_TYPES.youtube ? (
        <VideoPlayerStyled url={nowPlaying.src} playing={playing} />
      ) : (
        <VideoPlayerStyled
          ref={player}
          url={nowPlaying.src}
          playing={playing}
          onStart={() =>
            screenfull.request(findDOMNode(player.current)).catch(console.log)
          }
        />
      )}
    </div>
  );
}

const VideoPlayerStyled = styled(VideoPlayer)`
  width: 100%;
  min-height: 100vh;
  border: none;
`;

export default Player;
