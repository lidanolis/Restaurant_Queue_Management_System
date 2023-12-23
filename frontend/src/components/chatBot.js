import React, { useEffect } from "react";
import "../styles/chat.css";

function ChatBot() {
  const icons = {
    isClicked: "Clicked",
    isNotClicked: "Not Clicked",
  };

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

  return (
    <div className="container">
      <div className="chatbox">
        <div className="chatbox__support">
          <div className="chatbox__header">Chat support!</div>
          <div className="chatbox__messages">
            <div>
              <div className="messages__item messages__item--visitor">Hi!</div>
              <div className="messages__item messages__item--operator">
                What is it?
              </div>
              .
              <div className="messages__item messages__item--typing">
                <span className="messages__dot"></span>
                <span className="messages__dot"></span>
                <span className="messages__dot"></span>
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
