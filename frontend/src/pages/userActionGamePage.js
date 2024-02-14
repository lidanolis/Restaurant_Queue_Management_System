import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import makeToast from "../toast";
import { UserContext } from "../context/userContext";
import SingleCard from "../components/singleCard";
const cardImages = [
  { src: "/img/breadLogo.jpg", matched: false },
  { src: "/img/burgerLogo.png", matched: false },
  { src: "/img/chefLogo.jpg", matched: false },
  { src: "/img/noodleLogo.png", matched: false },
  { src: "/img/riceLogo.png", matched: false },
  { src: "/img/sushiLogo.png", matched: false },
];

function UserActionGamePage() {
  const [cards, setCards] = useState([]);
  const [gamePoints, setGamePoints] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();
  const {
    userId,
    role,
    waitingPoints,
    setWaitingPoints,
    restaurantId,
    inQueue,
    setInQueue,
    socket,
  } = useContext(UserContext);
  const shuffleCards = () => {
    const shuffleCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setCards(shuffleCards);
    setGamePoints(waitingPoints);
  };

  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        makeToast("success", "matched");
        var newPoints = waitingPoints + 1;
        setWaitingPoints(newPoints);
        setGamePoints(newPoints);
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 450);
      }
    }
  }, [choiceOne, choiceTwo]);
  useEffect(() => {
    const foundObject = cards.find((card) => !card.matched);

    if (!foundObject) {
      makeToast("success", "Starting New Round");
      setTimeout(() => shuffleCards(), 500);
    }
  }, [cards]);
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setDisabled(false);
  };
  useEffect(() => {
    shuffleCards();
  }, []);
  useEffect(() => {
    const handleGetSeat = (message) => {
      if (message.userId === userId && role === "user") {
        if (message.restaurantId === restaurantId) {
          if (inQueue) {
            setInQueue(false);
            makeToast("success", "Seat Found. Redirecting In 3 Seconds");
            setTimeout(
              () => navigate(`/user/seatPage/${message.tableName}`),
              3000
            );
          }
        }
      }
    };

    socket.on("getSeat", handleGetSeat);

    return () => {
      socket.off("getSeat", handleGetSeat);
    };
  }, []);
  return (
    <div className="UserActionGamePage">
      <div className="whiteBox">
        <div className="rowdisplay">
          <div>
            <label style={{ textAlign: "center" }} className="form-check-label">
              Please Note That Leaving The Page Will Retain The Points Earned
              But Will Restart The Match
            </label>
          </div>
        </div>
      </div>
      <div className="Game">
        <h1
          style={{
            color: "white",
            textShadow: "2px 2px 4px #000000",
            fontWeight: "bold",
            textDecoration: "underline",
          }}
        >
          FOOD MATCH
        </h1>
        <h1
          style={{
            color: "white",
            textShadow: "2px 2px 4px #000000",
            fontWeight: "bold",
          }}
        >
          Points Earned: {gamePoints}
        </h1>

        <div className="card-grid">
          {cards.map((card) => (
            <SingleCard
              key={card.id}
              card={card}
              handleChoice={handleChoice}
              flipped={card === choiceOne || card === choiceTwo || card.matched}
              disabled={disabled}
            ></SingleCard>
          ))}
        </div>
        <br />
        <div className="common">
          <button
            className="btnBasicDesign"
            onClick={() => {
              navigate("/user/home");
            }}
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserActionGamePage;
