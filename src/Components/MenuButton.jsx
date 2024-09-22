import React, { useState } from 'react';

const VirtualAssistant = () => {
  const [isSinging, setIsSinging] = useState(false);

  const singASong = (lyrics) => {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(lyrics);
      
      // Set voice properties for "singing"
      utterance.pitch = 1.2; // Higher pitch to simulate singing
      utterance.rate = 1; // Adjust the speed
      utterance.volume = 1; // Full volume
      utterance.voice = synth.getVoices()[0]; // Choose a voice, adjust index for a different one
      
      // Trigger speech synthesis
      synth.speak(utterance);
      setIsSinging(true);
      
      // When the song ends, reset the state
      utterance.onend = () => setIsSinging(false);
    } else {
      alert("Your browser does not support speech synthesis.");
    }
  };

  return (
    <div>
      <h2>Virtual Assistant</h2>
      <button onClick={() => singASong("Twinkle, twinkle, little star, how I wonder what you are!")}>
        {isSinging ? "Singing..." : "Sing a Song"}
      </button>
    </div>
  );
};

export default VirtualAssistant;
