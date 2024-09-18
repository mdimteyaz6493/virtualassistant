import { jobApplicationTemplate, leaveApplicationTemplate } from './letterformats'; // Import letter templates

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const lettercomp = async (type, speak,setletter) => {
    try {
        let userInputs = {};

        const promptUser = async (message) => {
            return getUserInput(message); // Show the input box with the same message after the delay
        };

        // Request user input for letter details
        if (type === 'leave') {
            userInputs.name = await promptUser('Please provide your name.');
            userInputs.startDate = await promptUser('Please provide the start date for your leave (e.g., 10th October 2024).');
            userInputs.endDate = await promptUser('Please provide the end date for your leave (e.g., 20th October 2024).');
            userInputs.reason = await promptUser('Please provide the reason for your leave.');
            
            userInputs.date = new Date().toLocaleDateString(); // Current date

            // Generate leave application
            const leaveLetter = leaveApplicationTemplate(
                userInputs.name,
                userInputs.date,
                userInputs.startDate,
                userInputs.endDate,
                userInputs.reason
            );
            
            speak('Here is your leave application.');
            setletter(leaveLetter)
            console.log(leaveLetter);
            speak(leaveLetter); // Store the generated letter in state
            
        } else if (type === 'job') {
            userInputs.name = await promptUser('Please provide your name.');
            userInputs.position = await promptUser('Please provide the job position you are applying for.');
            
            userInputs.date = new Date().toLocaleDateString(); // Current date

            // Generate job application
            const jobLetter = jobApplicationTemplate(
                userInputs.name,
                userInputs.date,
                userInputs.position
            );
            
            speak('Here is your job application.');
            setletter(jobLetter)
            console.log(jobLetter);
            speak(jobLetter); // Store the generated letter in state
            
        }

    } catch (error) {
        speak("An error occurred while generating the letter.");
        console.error("Error handling letter generation:", error);
    }
};

// Simulate user input collection (replace with actual chat input handling)
const getUserInput = (message) => {
    return new Promise((resolve) => {
        // Implement your chat input collection logic here
        // For demonstration, this is a placeholder that resolves with a fixed value
        setTimeout(() => resolve(prompt(message)), 1000);
    });
};

export default lettercomp;
