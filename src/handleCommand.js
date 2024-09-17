import axios from 'axios';
import hindijokes from './hindijokes';

const handleCommand = async (command, speak, setMessage, setImageUrls) => {
    const lowerCaseCommand = command.toLowerCase();
    console.log("Received command:", command);

    try {
        // Simulate a delay before processing the command
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 seconds delay

        if (lowerCaseCommand.includes("hello jarvis")) {
            speak("Hello, how can I assist you today?");
            console.log("Processed 'hello jarvis' command.");
        
        } else if (lowerCaseCommand.includes("your name")) {
            speak("My name is Jarvis");
        
        } else if (lowerCaseCommand.includes("developer")) {
            speak("I am developed by Md Imteyaz Alam on 17th September 2024");
        
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

        }
        else if (lowerCaseCommand.includes('hindi joke') || lowerCaseCommand.includes('hindi jokes')) {
            if (hindijokes.length > 0) {
                const randomIndex = Math.floor(Math.random() * hindijokes.length);
                const joke = hindijokes[randomIndex].joke; // Accessing the joke property
                speak(joke);
                console.log(`Hindi Joke: ${joke}`);
            } else {
                speak('Sorry, I don’t have any Hindi jokes at the moment.');
            }
        
        } 
             else if (lowerCaseCommand.match(/(nice|very good|awesome|funny|good|amazing)/)) {
            speak("Thanks, I always try to give my best.");
        
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

        } else if (lowerCaseCommand.match(/(what is|who is|where|why|can you tell|you know about|about)/)) {
            const query = lowerCaseCommand.replace(/(what is|who is|where|why|can you tell|you know about|about)/, "").trim();
            console.log("Query for Wikipedia:", query);

            if (query) {
                speak(`Searching for information about ${query}.`);
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

        } else if (lowerCaseCommand.startsWith("image of ")) {
            const query = lowerCaseCommand.replace("image of ", "").trim();

            if (query) {
                speak(`Searching for images of ${query}.`);
                const apiKey = 'c7OKNdiPBZp7A0NWDYtCNySGpBdpUKTmG3Grgb32gY8'; // Replace with your Unsplash API key
                const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${apiKey}&per_page=4`; // Request 4 images

                try {
                    const response = await axios.get(url);
                    const imageUrls = response.data.results.map(image => image.urls.small); // Extract URLs of the images

                    if (imageUrls.length > 0) {
                        setImageUrls(imageUrls); // Set the array of image URLs for displaying
                    } else {
                        speak("Sorry, I couldn't find any images for that query.");
                    }
                } catch (error) {
                    speak("An error occurred while fetching images.");
                    console.error("Error fetching Unsplash images:", error);
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
