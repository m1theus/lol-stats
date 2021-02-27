import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Badge, Table } from 'reactstrap';
import axios from 'axios';

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:1337';

const formatPlayerKDA = ({ kills, deaths, assists } = {}) =>
  `${kills}/${deaths}/${assists}`;

const formatPlayerName = ({ summonerName, championId, role } = {}) =>
  `${summonerName} - ${championId} - ${capitalizeFirstLetter(role)}`;

const capitalizeFirstLetter = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function Game(props) {
  const [didMount, setDidMount] = useState(false);
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [gameMetadata, setGameMetadata] = useState({});
  const [matchMetadata, setMatchMetadata] = useState({});
  const [blueTeamPlayers, setBlueTeamPlayers] = useState([]);
  const [redTeamPlayers, setRedTeamPlayers] = useState([]);

  const matchId = props.location.state.matchId;

  if (!matchId) {
    history.goBack();
  }

  useEffect(() => {
    async function fetchGameByMatchId() {
      setIsLoading(true);
      const gameData = await fetchGame(matchId);
      setGameMetadata(gameData);

      const matchData = await fetchMatchMetadata({
        gameId: gameData.id,
        firstEvent: true,
      });
      setMatchMetadata(matchData);
      setBlueTeamPlayers(matchData?.blueTeamMetadata.players ?? []);
      setRedTeamPlayers(matchData?.redTeamMetadata.players ?? []);
      setIsLoading(false);
    }
    setDidMount(true);
    fetchGameByMatchId()
      .then()
      .catch(() => {
        history.goBack();
        setDidMount(false);
      });
  }, [matchId, history]);

  useInterval(async () => {
    const gameData = await fetchGame(matchId);
    const matchData = await fetchMatchMetadata({
      gameId: gameData.id,
    });

    if (gameData) {
      setGameMetadata(gameData);
    }

    if (matchData) {
      setMatchMetadata(matchData);
      setBlueTeamPlayers(matchData?.blueTeamMetadata.players ?? []);
      setRedTeamPlayers(matchData?.redTeamMetadata.players ?? []);
    }
  }, 2000);

  const fetchGame = async (matchId) => {
    const { data } = await axios.get(`${SERVER_URL}/games/${matchId}`);
    return data;
  };

  const fetchMatchMetadata = async ({ gameId, firstEvent = false }) => {
    const { data } = await axios.get(
      `${SERVER_URL}/games/detail/${gameId}?firstEvent=${firstEvent}`
    );
    return data;
  };

  if (!didMount) {
    return null;
  }

  return (
    <>
      <center className="mb-2 mt-4">
        <Link to="/">Back</Link>
      </center>
      {isLoading === true ? (
        <div>loading...</div>
      ) : (
        <div className="bg-dark">
          <div className="text-white">GameId: {matchMetadata.gameId}</div>
          <div className="text-white">
            Game Status:{' '}
            {gameMetadata?.state === 'inProgress' ? (
              <Badge pill color="success">
                In Progress
              </Badge>
            ) : (
              <Badge color="danger">Finished</Badge>
            )}
            <div className="text-white">Game Time: {matchMetadata.time}</div>
          </div>
          <Table striped dark>
            <thead>
              <tr>
                <th>Team</th>
                <th>Total Gold</th>
                <th>Inhibitors</th>
                <th>Towers</th>
                <th>Total Kills</th>
                <th>Barons</th>
                <th>Dragons</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Blue Team</th>
                <td>{matchMetadata?.blueTeamMetadata?.totalGold}</td>
                <td>{matchMetadata?.blueTeamMetadata?.inhibitors}</td>
                <td>{matchMetadata?.blueTeamMetadata?.towers}</td>
                <td>{matchMetadata?.blueTeamMetadata?.totalKills}</td>
                <td>{matchMetadata?.blueTeamMetadata?.barons}</td>
                <td>{matchMetadata?.blueTeamMetadata?.dragons}</td>
              </tr>
              <tr>
                <th scope="row">Red Team</th>
                <td>{matchMetadata?.redTeamMetadata?.totalGold}</td>
                <td>{matchMetadata?.redTeamMetadata?.inhibitors}</td>
                <td>{matchMetadata?.redTeamMetadata?.towers}</td>
                <td>{matchMetadata?.redTeamMetadata?.totalKills}</td>
                <td>{matchMetadata?.redTeamMetadata?.barons}</td>
                <td>{matchMetadata?.redTeamMetadata?.dragons}</td>
              </tr>
            </tbody>
          </Table>
          <Table striped dark>
            <thead>
              <tr>
                <th>Blue Team / Player Name</th>
                <th>Total Gold</th>
                <th>Level</th>
                <th>KDA</th>
                <th>Creeps</th>
              </tr>
            </thead>
            <tbody>
              {blueTeamPlayers.map((player) => {
                return (
                  <tr key={player.participantId}>
                    <th scope="row">{formatPlayerName(player)}</th>
                    <td>{player?.totalGold}</td>
                    <td>{player?.level}</td>
                    <td>{formatPlayerKDA(player)}</td>
                    <td>{player?.creepScore}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <Table striped dark>
            <thead>
              <tr>
                <th>Red Team / Player Name</th>
                <th>Total Gold</th>
                <th>Level</th>
                <th>KDA</th>
                <th>Creeps</th>
              </tr>
            </thead>
            <tbody>
              {redTeamPlayers.map((player) => {
                return (
                  <tr key={player.participantId}>
                    <th scope="row">{formatPlayerName(player)}</th>
                    <td>{player?.totalGold}</td>
                    <td>{player?.level}</td>
                    <td>{formatPlayerKDA(player)}</td>
                    <td>{player?.creepScore}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
}

export default Game;
