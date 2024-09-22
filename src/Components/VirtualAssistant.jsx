import React, { useState, useEffect, useRef, useContext } from "react";
import handleCommand from "../handleCommand"; // Import the handleCommand function
import { IoSendSharp } from "react-icons/io5";
import { FaMicrophone } from "react-icons/fa";
import { AppContext } from "../Context/AppContext";
import { TbMenuDeep } from "react-icons/tb";
import ImageBox from "./ImageBox";

const VirtualAssistant = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [inputText, setInputText] = useState("");
  const [defaultVoice, setDefaultVoice] = useState(null);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [letter, setletter] = useState("");
  const [openletter, setopenletter] = useState(false);
  const { openModal, setopenModal, openMenu, setopenMenu } =
    useContext(AppContext);

  const chatBoxRef = useRef(null);
  const latestMessageRef = useRef(null);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    if (window.speechSynthesis) {
      const fetchVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        const microsoftRaviVoice = voices.find((voice) =>
          voice.name.includes("Microsoft Ravi")
        );

        if (microsoftRaviVoice) {
          setDefaultVoice(microsoftRaviVoice);
        }
      };

      if (window.speechSynthesis.getVoices().length > 0) {
        fetchVoices();
      } else {
        window.speechSynthesis.onvoiceschanged = fetchVoices;
      }
    }
  }, []);

  useEffect(() => {
    if (chatBoxRef.current && latestMessageRef.current) {
      latestMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [chatHistory]);

  const startListening = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    if (recognition) {
      recognition.start();
      recognition.onstart = () => {
        console.log("Voice recognition started");
        setIsUserSpeaking(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("Transcript received:", transcript);
        setIsUserSpeaking(false);
        updateChatHistory(transcript, "user");
        handleAssistantResponse(transcript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsUserSpeaking(false);
      };
    } else {
      console.error("Speech recognition not supported in this browser.");
    }
  };

  useEffect(() => {
    if (recognition) {
      recognition.onstart = () => {
        console.log("Voice recognition started");
        setIsUserSpeaking(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsUserSpeaking(false);
        updateChatHistory(transcript, "user");
        handleAssistantResponse(transcript);
      };
    }
  }, [recognition]);

  const speak = (text) => {
    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      if (defaultVoice) {
        utterance.voice = defaultVoice;
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  const updateChatHistory = (message, sender) => {
    setChatHistory((prevChatHistory) => [
      ...prevChatHistory,
      { message, sender },
    ]);
  };

  const handleTextChange = (e) => {
    setInputText(e.target.value);
    setIsUserTyping(true);
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      setIsUserTyping(false);
      updateChatHistory(inputText, "user");
      handleAssistantResponse(inputText);
      setInputText("");
    }
  };

  const handleAssistantResponse = (command) => {
    setIsAssistantTyping(true);
    handleCommand(
      command,
      (response) => {
        speak(response);
        setIsAssistantTyping(false);
        updateChatHistory(response, "assistant");
      },
      (newPics) => {},
      openletterModal
    );
  };

  const openletterModal = () => {
    setopenlmodal(true);
  };

  const handlemenuButton = () => {
    setopenMenu(!openMenu);
  };

  return (
    <>
      <div className="container">
        <button className="menu_button" onClick={handlemenuButton}>
          <TbMenuDeep />
        </button>
        <div ref={chatBoxRef} className="chatBox">
          {chatHistory.length === 0 && (
            <div className="welcome">
              <div className="logo_cont">
                <FaMicrophone className="logo" />
              </div>
            </div>
          )}

          {chatHistory.map((chat, index) => (
            <div
              key={index}
              style={{
                ...styles.chatMessage,
                justifyContent:
                  chat.sender === "user" ? "flex-end" : "flex-start",
              }}
            >
              {chat.sender === "assistant" ? (
                <p
                  className="assistant"
                  ref={
                    index === chatHistory.length - 1 ? latestMessageRef : null
                  }
                >
                  {chat.message}
                </p>
              ) : (
                <p
                  style={styles[chat.sender]}
                  ref={
                    index === chatHistory.length - 1 ? latestMessageRef : null
                  }
                >
                  {chat.message}
                </p>
              )}
            </div>
          ))}
          {letter && <pre>letter {letter}</pre>}
          {isAssistantTyping && (
            <div style={styles.chatMessage2}>
              <div class="loading">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          {isUserTyping && (
            <div style={styles.chatMessage}>
              <p style={styles.user}>You are typing...</p>
            </div>
          )}
          {isUserSpeaking && (
            <div style={styles.chatMessage}>
              <p style={styles.user}>You are speaking...</p>
            </div>
          )}
        </div>

        <form className="inputForm" onSubmit={handleTextSubmit}>
          <input
            type="text"
            style={styles.inputField}
            placeholder="Type your command..."
            value={inputText}
            onChange={handleTextChange}
          />
          <div className="mic">
            <FaMicrophone className="micro" onClick={startListening} />
          </div>
          <div className="send_div">
            <button type="submit">
              <IoSendSharp className="send" />
            </button>
          </div>
        </form>
      </div>
      {openModal && <ImageBox/>}
    </>
  );
};

const styles = {
  chatMessage: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "30px",
  },
  chatMessage2: {
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: "30px",
  },
  user: {
    backgroundColor: "purple",
    padding: "10px",
    borderRadius: "10px",
    maxWidth: "80%",
  },
  imageGallery: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "20px",
  },
  image: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    cursor: "pointer",
    borderRadius: "10px",
  },
};

export default VirtualAssistant;
