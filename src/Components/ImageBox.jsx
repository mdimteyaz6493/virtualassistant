import React, { useContext, useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { AppContext } from "../Context/AppContext";
import axios from "axios"; // Ensure axios is imported

const ImageBox = () => {
  const { openModal, setopenModal } = useContext(AppContext);
  const [searchValue, setsearchValue] = useState("");
  const [pics, setpics] = useState([]);

  // Define some sample image URLs
  const sampleImages = [
    "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "https://images.unsplash.com/photo-1467453678174-768ec283a940?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NTA0ODZ8MHwxfHNlYXJjaHwxNXx8ZnJ1aXRzfGVufDB8fHx8MTcyNjk5MzU2M3ww&ixlib=rb-4.0.3&q=80&w=1080",
    "https://images.unsplash.com/photo-1581337204873-ef36aa186caa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NTA0ODZ8MHwxfHNlYXJjaHw4fHxwYWludGluZ3xlbnwwfHx8fDE3MjY5OTM1OTZ8MA&ixlib=rb-4.0.3&q=80&w=1080",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NTA0ODZ8MHwxfHNlYXJjaHw0fHxjYXJzfGVufDB8fHx8MTcyNjk5MzUzM3ww&ixlib=rb-4.0.3&q=80&w=1080",
    "https://images.unsplash.com/photo-1627392450789-33619e8ceddd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1NTA0ODZ8MHwxfHNlYXJjaHwyfHxzdXBlciUyMGNhcnN8ZW58MHx8fHwxNzI2OTkzNjMyfDA&ixlib=rb-4.0.3&q=80&w=1080",
    
  ];

  // Populate sample images on initial render
  useEffect(() => {
    setpics(sampleImages);
  }, []);

  const speak = (message) => {
    const speech = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(speech);
  };

  const getImage = async () => {
    speak(`searching images of ${searchValue}`)
    const apiKey = "c7OKNdiPBZp7A0NWDYtCNySGpBdpUKTmG3Grgb32gY8";
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
      searchValue
    )}&client_id=${apiKey}&per_page=30`; // Request 30 images

    try {
      const response = await axios.get(url);
      const picUrls = response.data.results.map((image) => image.urls.small);
      setpics(picUrls);

      if (picUrls.length > 0) {
        localStorage.setItem("imageUrls", JSON.stringify(picUrls));
      } else {
        speak("Sorry, I couldn't find any images for that query.");
      }
    } catch (error) {
      speak("An error occurred while fetching images.");
      console.error("Error fetching Unsplash images:", error);
    }
  };

  // Open high-quality image in a new tab
  const openHighQualityImage = (imageUrl) => {
    window.open(imageUrl.replace("w=400", "w=1080"), "_blank"); // Open a high-resolution version
  };

  return (
    <>
      <div className="img_box">
        <MdClose
          className="img_box_close"
          onClick={() => setopenModal(false)}
        />
        <div className="search_form">
          <div className="input_area">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setsearchValue(e.target.value)}
              placeholder="search your image"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                 getImage() // Replace with your function name
                }
              }}
            />

            <button onClick={getImage}>Search</button>
          </div>
          <div className="result_area">
            {pics.map((pic, index) => (
              <img
                key={index}
                src={pic}
                alt={`Result ${index}`}
                onClick={() => openHighQualityImage(pic)} // Open high-quality version on click
                style={{ cursor: "pointer" }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageBox;
