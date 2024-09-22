import axios from 'axios';
import hindijokes from './hindijokes';
import lyricsCollection from './lyrics';

const handleCommand = async (command, speak, openletterModal) => {
    const lowerCaseCommand = command.toLowerCase();
    console.log("Received command:", command);

    try {
        // Simulate a delay before processing the command
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds delay

        if (lowerCaseCommand.includes("hello")) {
            speak("Hello, how can I assist you today?");
        
        } else if (lowerCaseCommand.includes("your name")) {
            speak("My name is Jarvis");
        
        } else if (lowerCaseCommand.includes("who are you")) {
            speak("I am a virtual assistant.");
        
        } else if (lowerCaseCommand.includes("developer")) {
            speak("I was developed by Md Imteyaz Alam on 17th September 2024");
        
        } else if (lowerCaseCommand.match(/(nice|awesome|good|very good|op|amazing|wow|omg)/)) {
            speak("Thanks, I always try to give my best.");

        } else if (lowerCaseCommand.includes('poem') || lowerCaseCommand.includes('sing a poem')) {
            // Randomly select a poem from the lyrics collection
            const randomIndex = Math.floor(Math.random() * lyricsCollection.length);
            const selectedPoem = lyricsCollection[randomIndex];
    
            speak(`Singing ${selectedPoem.title}.`);
    
            // Function to simulate singing by adjusting pitch and rate
            const singLine = (line, index) => {
                const utterance = new SpeechSynthesisUtterance(line);
    
                // Adjust pitch and rate for a musical effect
                 utterance.pitch = 1.2;  // Higher pitch to simulate singing
                 utterance.rate = 1;      // Adjust the speed for better effect
                 utterance.volume = 1;
                utterance.voice = window.speechSynthesis.getVoices()[0];
    
                // Speak the line with a slight delay for rhythm
                setTimeout(() => {
                    window.speechSynthesis.speak(utterance);
                }, index * 2000); // Adjust timing for each line
            };
    
            // Speak each line with a delay to simulate singing in tune
            selectedPoem.lines.forEach((line, index) => singLine(line, index));
    
            console.log("Singing the poem:", selectedPoem.title, selectedPoem.lines);
        }
        else if (lowerCaseCommand.includes('english joke') || lowerCaseCommand.includes('english jokes')) {
            const language = 'en';
            try {
                const response = await axios.get(`https://v2.jokeapi.dev/joke/Any?lang=${language}`);
                const joke = response.data.type === 'single' ? response.data.joke : `${response.data.setup} - ${response.data.delivery}`;
                speak(joke);
                console.log(`Joke: ${joke}`);
            } catch (error) {
                speak('Sorry, I could not fetch a joke right now.');
                console.error('Error fetching joke:', error);
            }

        } else if (lowerCaseCommand.includes('hindi joke') || lowerCaseCommand.includes('hindi jokes')) {
            if (hindijokes.length > 0) {
                const randomIndex = Math.floor(Math.random() * hindijokes.length);
                const joke = hindijokes[randomIndex].joke;
                speak(joke);
                console.log(`Hindi Joke: ${joke}`);
            } else {
                speak('Sorry, I don’t have any Hindi jokes at the moment.');
            }

        } else if (lowerCaseCommand.startsWith("open ")) {
            const query = lowerCaseCommand.replace("open ", "").trim();
            let url;

            switch (query) {
                case "google":
                    url = "https://www.google.com";
                    speak("Opening Google.");
                    break;
                case "youtube":
                    url = "https://www.youtube.com";
                    speak("Opening YouTube.");
                    break;
                case "calculator":
                    url = "calculator://";
                    speak("Opening calculator.");
                    break;
                default:
                    url = `https://www.${query}.com`;
                    const isValidDomain = /^[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/.test(query);
                    if (!isValidDomain) {
                        speak(`Sorry, ${query} doesn't seem like a valid domain.`);
                        return;
                    }
                    speak(`Opening ${query}.`);
                    break;
            }

            window.open(url, "_blank");
            console.log(`Processed 'open' command with URL: ${url}`);

        } else if (lowerCaseCommand.match(/(what is|who is|where|why|can you tell|you know about|about|how)/)) {
            const query = lowerCaseCommand.replace(/(what is|who is|where|why|can you tell|you know about|about|how)/, "").trim();
            console.log("Query for Wikipedia:", query);

            if (query) {
                const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;

                try {
                    const response = await axios.get(url);
                    const data = response.data;

                    if (data && data.extract) {
                        speak(data.extract);
                        console.log(`Summary for ${query}:`, data.extract);
                    } else {
                        speak("Sorry, I couldn't find any information on that topic.");
                    }
                } catch (error) {
                    speak("An error occurred while fetching the information.");
                    console.error("Error fetching Wikipedia summary:", error);
                }
            } else {
                speak("Please specify what you want to search for.");
            }

        } else if (lowerCaseCommand.startsWith("play video ")) {
            const query = lowerCaseCommand.replace("play video ", "").trim();
            if (query) {
                const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
                speak(`Playing video: ${query}.`);
                window.open(url, "_blank");
                console.log(`Processed 'play video' command with URL: ${url}`);
            } else {
                speak("Please specify the video you want to play.");
            }

        } else {
            speak("Sorry, I did not understand that command.");
            console.log("Unhandled command:", command);
        }
    } catch (error) {
        speak("An error occurred while processing your command.");
        console.error("Error handling command:", error);
    }
};

export default handleCommand;
