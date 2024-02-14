import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/userContext";
import makeToast from "../toast";

function AdminChatbotManagePage({ specificAction }) {
  const pageParams = useParams();
  const chatbotId = pageParams.id;
  const navigate = useNavigate();
  const {
    restaurantId,
    socket,
    restaurantChatbotMessage,
    setRestaurantChatbotMessage,
  } = useContext(UserContext);
  const [questionPair, setQuestionPair] = useState("");
  const [answerPair, setAnswerPair] = useState("");
  const [usePair, setUsePair] = useState(true);
  const pathPairRef = useRef("none");

  const removeChatbotMessageToRestaurant = async () => {
    const newMessage = {
      chatbotId: chatbotId,
    };
    const updateNewMessage = await fetch(
      `http://localhost:8000/staff/removeChatbotMessage/${restaurantId}`,
      {
        method: "POST",
        body: JSON.stringify(newMessage),
        headers: { "Content-Type": "application/json" },
      }
    );
    const json = await updateNewMessage.json();
    if (!updateNewMessage.ok) {
      console.log("Invalid Credentials");
    } else {
      console.log("successfully removed");
    }
  };
  const modifyChatbotMessageToRestaurant = async () => {
    const newMessage = {
      questionPair: questionPair,
      answerPair: answerPair,
      pathPair: pathPairRef.current.value,
      usePair: usePair,
      chatbotId: chatbotId,
    };
    const updateNewMessage = await fetch(
      `http://localhost:8000/staff/modifyChatbotMessage/${restaurantId}`,
      {
        method: "POST",
        body: JSON.stringify(newMessage),
        headers: { "Content-Type": "application/json" },
      }
    );
    const json = await updateNewMessage.json();
    if (!updateNewMessage.ok) {
      console.log("Invalid Credentials");
    } else {
      console.log("successfully modified");
    }
  };
  const addChatbotMessageToRestaurant = async () => {
    const newMessage = {
      questionPair: questionPair,
      answerPair: answerPair,
      pathPair: pathPairRef.current.value,
      usePair: usePair,
    };
    const updateNewMessage = await fetch(
      `http://localhost:8000/staff/addChatbotMessage/${restaurantId}`,
      {
        method: "POST",
        body: JSON.stringify(newMessage),
        headers: { "Content-Type": "application/json" },
      }
    );
    const json = await updateNewMessage.json();
    if (!updateNewMessage.ok) {
      console.log("Invalid Credentials");
    } else {
      console.log("successfully added");
    }
  };
  const getChatbotMessageList = async (chatbotId) => {
    const getRestaurantId = await fetch(
      `http://localhost:8000/staff/getRestaurant/${restaurantId}`
    );
    const resultJson = await getRestaurantId.json();
    if (getRestaurantId.ok) {
      const foundObject = resultJson.chatbotSequence.find(
        (obj) => obj._id === chatbotId
      );

      if (foundObject) {
        setQuestionPair(foundObject.questionPair);
        setAnswerPair(foundObject.answerPair);
        pathPairRef.current.value = foundObject.pathPair;
        setUsePair(foundObject.usePair);
      } else {
        makeToast("error", "Chatbot Message Not Found");
        navigate("/admin/chatbot");
      }
    } else {
      makeToast("error", "Chatbot Message Not Found");
      navigate("/admin/chatbot");
    }
  };
  useEffect(() => {
    if (specificAction === "remove") {
      removeChatbotMessageToRestaurant().then(() => {
        navigate("/admin/chatbot");
      });
    } else if (specificAction === "modify") {
      getChatbotMessageList(chatbotId);
    }
  }, []);

  return (
    <div className="common">
      <div className="card">
        <div className="cardHeader">Chatbot Setup</div>
        <div className="cardBody">
          {specificAction === "modify" && (
            <div className="inputGroup">
              <div className="button-container d-flex gap-2">
                <label className="form-check-label">Message Status: </label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={usePair}
                    onClick={(e) => {
                      if (usePair) {
                        setUsePair(false);
                      } else {
                        setUsePair(true);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="inputGroup">
            <label>Question That Customer Can Ask:</label>
            <input
              type="text"
              name="QuestionPair"
              onChange={(e) => {
                setQuestionPair(e.target.value);
              }}
              value={questionPair}
              placeholder="-Question-"
            ></input>
          </div>
          <div className="inputGroup">
            <label>Answer That The Chatbot Will Provide:</label>
            <input
              type="text"
              name="AnswerPair"
              onChange={(e) => {
                setAnswerPair(e.target.value);
              }}
              value={answerPair}
              placeholder="-Answer-"
            ></input>
          </div>
          <div className="inputGroup">
            <label>Path That Will Be Directed To:</label>
            <select
              name="pathPairRef"
              defaultValue={pathPairRef.current.value}
              ref={pathPairRef}
              className="form-select"
            >
              <option value="none">-None-</option>
              <option value="profile">Customer Profile Path</option>
              <option value="status">Customer View Queue Path</option>
              <option value="game">Customer Game Path</option>
              <option value="voucher">Customer View Vouchers Path</option>
              <option value="menu">Customer View Menu Path</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: "85%" }}>
              *Not Providing A Path Or An Answer Is Permitted, But Not Both At
              Once.
            </label>
          </div>
          <br />
          <div className="button-container d-flex gap-2">
            <button
              className="btnBasicDesign"
              onClick={() => {
                navigate("/admin/chatbot");
              }}
            >
              Back
            </button>
            <button
              onClick={() => {
                if (questionPair === "") {
                  makeToast("error", "Question Cannot Be Empty");
                } else if (
                  answerPair === "" &&
                  pathPairRef.current.value === "none"
                ) {
                  makeToast("error", "Either Answer Or Path Must Be Inputted");
                } else {
                  if (specificAction === "add") {
                    addChatbotMessageToRestaurant().then(() => {
                      makeToast("success", "ChatBot Message Added");
                      navigate("/admin/chatbot");
                    });
                  } else {
                    modifyChatbotMessageToRestaurant().then(() => {
                      makeToast("success", "ChatBot Message Modified");
                      navigate("/admin/chatbot");
                    });
                  }
                }
              }}
              className="btnBasicDesign"
            >
              {specificAction}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminChatbotManagePage;
