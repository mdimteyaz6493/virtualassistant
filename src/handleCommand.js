import axios from 'axios';
import hindijokes from './hindijokes';
import lettercomp from './lettercomp';

const handleCommand = async (command, speak) => {
    const lowerCaseCommand = command.toLowerCase();
    console.log("Received command:", command);

    try {
        // Simulate a delay before processing the command
        await new Promise(resolve => setTimeout(resolve, 2000)); // 3 seconds delay

        if (lowerCaseCommand.includes("hello")) {
            speak("Hello, how can I assist you today?");
        
        } else if (lowerCaseCommand.includes("your name")) {
            speak("My name is Jarvis");
        
        } else if (lowerCaseCommand.includes("who are you")) {
            speak("I am a virtual assistant.");
        
        } else if (lowerCaseCommand.includes("developer")) {
            speak("I was developed by Md Imteyaz Alam on 17th September 2024");
        
        } else if (lowerCaseCommand.includes('english joke') || lowerCaseCommand.includes('english jokes')) {
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
                const joke = hindijokes[randomIndex].joke; // Accessing the joke property
                speak(joke);
                console.log(`Hindi Joke: ${joke}`);
            } else {
                speak('Sorry, I don’t have any Hindi jokes at the moment.');
            }
        
        } else if (lowerCaseCommand.includes("write a leave application")) {
            speak("Please provide your details for the leave application.");
            await lettercomp("leave", speak);
        
        } else if (lowerCaseCommand.includes("write a job application")) {
            speak("Please provide your details for the job application.");
            await lettercomp("job", speak);
        
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

        }  else if (lowerCaseCommand.startsWith("play video ")) {
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
