import React, { useContext, useEffect, useState } from "react";
import "../styles/chat.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import makeToast from "../toast";
function ChatBot() {
  const navigate = useNavigate();
  const {
    role,
    socket,
    restaurantId,
    userId,
    restaurantChatbotMessage,
    chosenGame,
  } = useContext(UserContext);
  const icons = {
    isClicked: "Good Bye",
    isNotClicked: "Talk To Me",
  };
  const [chatbotMessages, setChatbotMessages] = useState([]);
  useEffect(() => {
    const chatButton = document.querySelector(".chatbox__button");
    const chatContent = document.querySelector(".chatbox__support");

    class InteractiveChatbox {
      constructor(a, b, c) {
        this.args = {
          button: a,
          chatbox: b,
        };
        this.icons = c;
        this.state = false;
      }

      display() {
        const { button, chatbox } = this.args;

        button.addEventListener("click", () => this.toggleState(chatbox));
      }

      toggleState(chatbox) {
        this.state = !this.state;
        this.showOrHideChatBox(chatbox, this.args.button);
      }

      showOrHideChatBox(chatbox, button) {
        if (this.state) {
          chatbox.classList.add("chatbox--active");
          this.toggleIcon(true, button);
        } else if (!this.state) {
          chatbox.classList.remove("chatbox--active");
          this.toggleIcon(false, button);
        }
      }

      toggleIcon(state, button) {
        const { isClicked, isNotClicked } = this.icons;
        let b = button.children[0].innerHTML;

        if (state) {
          button.children[0].innerHTML = isClicked;
        } else if (!state) {
          button.children[0].innerHTML = isNotClicked;
        }
      }
    }

    const chatbox = new InteractiveChatbox(chatButton, chatContent, icons);
    chatbox.display();
    chatbox.toggleIcon(false, chatButton);
  }, []);

  const resetMessage = () => {
    const firstMessage = {
      message:
        "Hi, I am your personal assistant that can help you to better navigate this website!",
      type: "staff",
      id: 0,
    };
    const secondMessage = {
      message: "What Questions Do You Want Answered?",
      type: "staff",
      id: 1,
    };
    setChatbotMessages(() => [firstMessage, secondMessage]);
  };

  useEffect(() => {
    resetMessage();
  }, []);

  return (
    <div className="container">
      <div className="chatbox">
        <div className="chatbox__support">
          <div className="chatbox__header">-Chatbot Support-</div>
          <div className="chatbox__messages">
            <div>
              <br />
              <div>
                {chatbotMessages.map((theMessages, index) => (
                  <>
                    {(theMessages.id === 0 || theMessages.id === 1) && (
                      <div className="messages__item messages__item--visitor--begin">
                        {theMessages.message}
                      </div>
                    )}
                    {theMessages.id === 1 && (
                      <>
                        {restaurantChatbotMessage.map(
                          (chatbotMessage) =>
                            chatbotMessage.usePair && (
                              <React.Fragment>
                                <br />
                                <div
                                  className="messages__item messages__item--visitor"
                                  onClick={() => {
                                    const findMessage =
                                      restaurantChatbotMessage.find(
                                        (message) =>
                                          message._id === chatbotMessage._id
                                      );
                                    const newUserMessage = {
                                      message: findMessage.questionPair,
                                      type: "user",
                                      id: chatbotMessage._id,
                                    };
                                    const newAnswerMessage = {
                                      message: findMessage.answerPair,
                                      type: "answer",
                                      id: chatbotMessage._id,
                                    };
                                    const newPathMessage = {
                                      message:
                                        "If You Wish To Know More About It, Click Below:",
                                      type: "path",
                                      id: chatbotMessage._id,
                                    };
                                    if (findMessage.pathPair === "none") {
                                      setChatbotMessages((prevMessage) => [
                                        ...prevMessage,
                                        newUserMessage,
                                        newAnswerMessage,
                                      ]);
                                    } else {
                                      setChatbotMessages((prevMessage) => [
                                        ...prevMessage,
                                        newUserMessage,
                                        newAnswerMessage,
                                        newPathMessage,
                                      ]);
                                    }
                                  }}
                                >
                                  {chatbotMessage.questionPair}
                                </div>
                              </React.Fragment>
                            )
                        )}
                        <br />
                        <div className="messages__item messages__item--operator">
                          -Click The Questions To Reply-
                        </div>
                      </>
                    )}

                    {theMessages.type === "user" && (
                      <>
                        <br />
                        <div className="messages__item messages__item--operator">
                          {theMessages.message}
                        </div>
                      </>
                    )}
                    {theMessages.type === "answer" && (
                      <>
                        <br />
                        <div className="messages__item messages__item--visitor--begin">
                          {theMessages.message}
                        </div>
                      </>
                    )}
                    {theMessages.type === "path" && (
                      <>
                        <br />
                        <div className="messages__item messages__item--visitor--begin">
                          {theMessages.message}
                        </div>
                        <button
                          className="messages__item messages__item--visitor"
                          onClick={() => {
                            const findObject = restaurantChatbotMessage.find(
                              (amess) => amess._id === theMessages.id
                            );

                            if (findObject.pathPair === "profile") {
                              navigate("/profile");
                            } else if (findObject.pathPair === "status") {
                              navigate("/user/tableStatus/" + restaurantId);
                            } else if (findObject.pathPair === "game") {
                              if (chosenGame === "wait") {
                                navigate("/user/customerWaitingGame");
                              } else {
                                navigate("/user/customerActionGame");
                              }
                            } else if (findObject.pathPair === "voucher") {
                              navigate("/user/voucherPage/" + restaurantId);
                            } else if (findObject.pathPair === "menu") {
                              navigate(
                                "/user/queueRestaurantMenu/" + restaurantId
                              );
                            }
                          }}
                        >
                          Take Me There
                        </button>
                        <br />
                      </>
                    )}
                    {index + 1 == chatbotMessages.length &&
                      (theMessages.type === "answer" ||
                        theMessages.type === "path") && (
                        <>
                          <br />
                          <div
                            className="messages__item messages__item--operator--nQuestion"
                            onClick={() => {
                              resetMessage();
                            }}
                          >
                            I Want To Ask Another Question (Click)
                          </div>
                        </>
                      )}
                  </>
                ))}
                <br />

                <div className="messages__item messages__item--typing">
                  <span className="messages__dot"></span>
                  <span className="messages__dot"></span>
                  <span className="messages__dot"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="chatbox__button">
          <button>Branch-1</button>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
