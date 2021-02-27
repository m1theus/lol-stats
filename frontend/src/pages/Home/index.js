import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Row, Col, Card, CardBody, Badge } from 'reactstrap';
import axios from 'axios';

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || 'http://localhost:1337';

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

function Home() {
  const history = useHistory();
  const [liveGames, setLiveGames] = useState([]);

  useEffect(() => {
    const fetchLiveGames = async () => {
      const { data } = await axios.get(`${BACKEND_URL}/games/live`);
      setLiveGames(data);
    };
    fetchLiveGames();
  }, []);

  useInterval(() => {
    const fetchLiveGames = async () => {
      const { data } = await axios.get(`${BACKEND_URL}/games/live`);
      setLiveGames(data);
    };
    fetchLiveGames();
  }, 60 * 1000);

  const showGameDetails = (id) => history.push('/game', { matchId: id });

  return (
    <div className="bg-dark container">
      <h1 className="mt-5 mb-5 d-flex align-items-center justify-content-center">
        <Badge pill color="danger">
          LIVE
        </Badge>
        Games
      </h1>
      <Row className="m-0">
        {liveGames.length ? (
          liveGames?.map((game, _index) => {
            return (
              <Col sm={4} className="p-2" key={game.id}>
                <Card
                  className="text-white bg-primary"
                  style={{ cursor: 'pointer' }}
                >
                  <CardBody onClick={() => showGameDetails(game.id)}>
                    <div className="align-items-center justify-content-center">
                      <div className="align-center ">
                        <img
                          width="50%"
                          src={game.league.image}
                          alt={game.league.name}
                        />
                        <div className="text-value ">
                          <strong>Game Id: </strong>
                          {game.id}
                        </div>
                        <div className="text-value ">
                          <strong>League: </strong>
                          {game.league.name}
                        </div>
                        <div className="text-value ">{game.blockName}</div>
                        <div className="text-value ">{game.status}</div>
                        {game?.match?.teams[0]?.name ? (
                          <div className="text-value ">
                            <strong>
                              {game?.match?.teams[0]?.name} x{' '}
                              {game?.match?.teams[1]?.name}
                            </strong>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            );
          })
        ) : (
          <>
            <Row className="m-0">
              <Col className="p-2">
                <div className=" text-white ">Not found live game!</div>
              </Col>
            </Row>
          </>
        )}
      </Row>
    </div>
  );
}

export default Home;
