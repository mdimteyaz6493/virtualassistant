import React, { useState, useEffect, useRef } from "react";
import handleCommand from "../handleCommand"; // Import the handleCommand function
import { IoSendSharp } from "react-icons/io5";
import { FaMicrophone } from "react-icons/fa";

const VirtualAssistant = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [inputText, setInputText] = useState("");
  const [defaultVoice, setDefaultVoice] = useState(null);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);

  const chatBoxRef = useRef(null);
  const latestMessageRef = useRef(null);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    if (window.speechSynthesis) {
      const fetchVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        const microsoftRaviVoice = voices.find((voice) => voice.name.includes("Microsoft Ravi"));

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
    handleCommand(command,(response) => {
      speak(response);
      setIsAssistantTyping(false);
      updateChatHistory(response, "assistant");
    }, (newPics) => {
      setpics(newPics); // Update images in state
      localStorage.setItem('imageUrls', JSON.stringify(newPics)); // Save to localStorage
    });
  };

 
  return (
    <div className="container">
      <h1>Virtual Assistant</h1>

      <div ref={chatBoxRef} className="chatBox">
        {chatHistory.length === 0 && (
          <div style={styles.welcomeMessage}>
            <p>Welcome! How can I assist you today?</p>
          </div>
        )}

        {chatHistory.map((chat, index) => (
          <div
            key={index}
            style={{
              ...styles.chatMessage,
              justifyContent: chat.sender === "user" ? "flex-end" : "flex-start",
            }}
          >
            {chat.sender === "assistant" ? (
              <p className="assistant" ref={index === chatHistory.length - 1 ? latestMessageRef : null}>{chat.message}</p>
            ) : (
              <p style={styles[chat.sender]} ref={index === chatHistory.length - 1 ? latestMessageRef : null}>{chat.message}</p>
            )}
          </div>
        ))}

        {isAssistantTyping && (
          <div style={styles.chatMessage2}>
            <p style={styles.assistant}>Assistant is typing...</p>
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
        <button type="submit">
          <IoSendSharp className="send"/>
        </button>

        <div className="mic">
          <FaMicrophone className="micro" onClick={startListening} />
        </div>
      </form>
    </div>
  );
};

const styles = {
  chatMessage: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "10px",
  },
  chatMessage2: {
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: "10px",
  },
  user: {
    backgroundColor: "#d1e7ff",
    padding: "10px",
    borderRadius: "10px",
    maxWidth: "80%",
  },
  assistant: {
    backgroundColor: "#f1f1f1",
    padding: "10px",
    borderRadius: "10px",
    maxWidth: "80%",
  },
  inputField: {
    width: "80%",
    padding: "10px",
    borderRadius: "5px",
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
  welcomeMessage: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "20%",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    textAlign: "center",
    fontSize: "16px",
    color: "#333",
  },
};

export default VirtualAssistant;
