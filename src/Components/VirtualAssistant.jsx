import React, { useState, useEffect, useRef } from "react";
import handleCommand from "../handleCommand"; // Import the handleCommand function

const VirtualAssistant = () => {
  const [chatHistory, setChatHistory] = useState([]); // Store chat history
  const [inputText, setInputText] = useState(""); // Text input from the user
  const [defaultVoice, setDefaultVoice] = useState(null);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false); // Typing indicator for assistant
  const [isUserTyping, setIsUserTyping] = useState(false); // Typing indicator for user
  const [imageUrls, setImageUrls] = useState([]); // State for storing image URLs

  // Ref for the chat box
  const chatBoxRef = useRef(null);

  // Initialize speech recognition
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  useEffect(() => {
    // Fetch the list of available voices and set Microsoft Ravi as the default voice
    const fetchVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const microsoftRaviVoice = voices.find((voice) =>
        voice.name.includes("Microsoft Ravi")
      );

      if (microsoftRaviVoice) {
        setDefaultVoice(microsoftRaviVoice); // Set Ravi as the default voice
      }
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      fetchVoices();
    } else {
      window.speechSynthesis.onvoiceschanged = fetchVoices;
    }
  }, []);

  useEffect(() => {
    // Scroll to the bottom of the chat box whenever chatHistory changes
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const startListening = () => {
    setImageUrls([]);
    recognition.start();
  };

  recognition.onstart = () => {
    console.log("Voice recognition started");
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    updateChatHistory(transcript, "user"); // Display user command first
    handleAssistantResponse(transcript); // Process the command and get assistant's response
  };

  // Handle Text-to-Speech with Microsoft Ravi as the default voice
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    if (defaultVoice) {
      utterance.voice = defaultVoice; // Set Microsoft Ravi as the voice
    }
    window.speechSynthesis.speak(utterance);
  };

  // Update chat history with user or assistant messages
  const updateChatHistory = (message, sender) => {
    setChatHistory((prevChatHistory) => [
      ...prevChatHistory,
      { message, sender },
    ]);
  };

  // Handle user text input
  const handleTextChange = (e) => {
    setInputText(e.target.value);
    setIsUserTyping(true); // Show "typing" indicator for user
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      setIsUserTyping(false); // Hide "typing" indicator for user
      updateChatHistory(inputText, "user"); // Display user command first
      handleAssistantResponse(inputText); // Process the command and get assistant's response
      setInputText(""); // Clear the input field
    }
  };

  // Handle the assistant's response, show "typing" before responding
  const handleAssistantResponse = (command) => {
    setIsAssistantTyping(true); // Show "typing" indicator for assistant
    handleCommand(command, (response) => {
      // After receiving the assistant's response
      speak(response);
      setIsAssistantTyping(false); // Remove "typing" indicator
      updateChatHistory(response, "assistant"); // Display assistant's response
    }, null, setImageUrls); // Pass setImageUrls to handleCommand
  };

  // Open image in a new tab
  const openImage = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="container">
      <h1>Virtual Assistant</h1>

      <div ref={chatBoxRef} className="chatBox">
        {/* Display chat history */}
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            style={{
              ...styles.chatMessage,
              justifyContent: chat.sender === "user" ? "flex-end" : "flex-start",
            }}
          >
            <p style={styles[chat.sender]}>{chat.message}</p>
          </div>
        ))}

        {/* Display images */}
        {imageUrls.length > 0 && (
          <div style={styles.imageGallery}>
            {imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Search Result ${index + 1}`}
                style={styles.image}
                onClick={() => openImage(url)}
              />
            ))}
          </div>
        )}

        {/* Show "Assistant is typing" message when processing */}
        {isAssistantTyping && (
          <div style={styles.chatMessage2}>
            <p style={styles.assistant}>Assistant is typing...</p>
          </div>
        )}

        {/* Show "User is typing" message when user is typing */}
        {isUserTyping && (
          <div style={styles.chatMessage}>
            <p style={styles.user}>You are typing...</p>
          </div>
        )}
      </div>

      {/* Text input for typing */}
      <form style={styles.inputForm} onSubmit={handleTextSubmit}>
        <input
          type="text"
          style={styles.inputField}
          placeholder="Type your command..."
          value={inputText}
          onChange={handleTextChange}
        />
        <button style={styles.button} type="submit">
          Send
        </button>
      </form>

      {/* Button for voice input */}
      <button style={styles.button} onClick={startListening}>
        Start Voice Command
      </button>
    </div>
  );
};

const styles = {
  
  chatMessage: {
    display: "flex",
    justifyContent:"flex-end",
    marginBottom: "10px",
  },
  chatMessage2: {
    display: "flex",
    justifyContent:"flex-start",
    marginBottom: "10px",
  },
  user: {
    backgroundColor: "#d1e7ff",
    padding: "10px",
    borderRadius: "10px",
    maxWidth: "80%",
  },
  assistant: {
    backgroundColor: "#f0f0f0",
    padding: "10px",
    borderRadius: "10px",
    maxWidth: "80%",
  },
  inputForm: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  inputField: {
    flex: 1,
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    marginRight: "10px",
    fontSize: "16px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
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
