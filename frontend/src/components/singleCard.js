import React from "react";
import "./SingleCard.css";

function SingleCard({ card, handleChoice, flipped, disabled }) {
  const handleClick = () => {
    if (!disabled) {
      handleChoice(card);
    }
  };
  return (
    <div className="singleCard">
      <div className="card">
        <div className={flipped ? "flipped" : ""}>
          <img className="front" alt="card front" src={card.src}></img>
          <img
            className="back"
            alt="card back"
            onClick={handleClick}
            src="/img/cardBack.png"
          ></img>
        </div>
      </div>
    </div>
  );
}

export default SingleCard;
