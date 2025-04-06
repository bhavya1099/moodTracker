import React, { useEffect, useState } from "react";
import { OpenAI } from "openai";
import Image from "next/image";
import SpotifyPage from "./SpotifyPage";

export default function QuoteWindow({ mood, name }) {
  const [quote, setQuote] = useState("");
  const [openSpotify, setOpenSpotify] = useState(false);
  console.log("mood value", mood);
  useEffect(() => {
    const fetchQuote = async () => {
      const client = new OpenAI({
        apiKey: "", //process.env.REACT_APP_OPENAI_API_KEY, // Store API key securely
        dangerouslyAllowBrowser: true, // Needed if running in the browser
      });

      try {
        const response = await client.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: `Write a quote for a user named ${name} as he/she feels ${mood}`,
            },
          ],
        });
        console.log("ans", response.choices[0]?.message);
        setQuote(
          response.choices[0]?.message?.content || "No response received."
        );
      } catch (error) {
        console.error("Error fetching quote:", error);
        setQuote("Failed to fetch quote.");
      }
    };
    fetchQuote();
  }, []);

  const chooseImg = () => {
    const images = {
      Sad: "/assets/JoyandSad.jpeg",
      Joy: "/assets/happy.jpeg",
      Ennui: "/assets/ennui.jpeg",
      Anxiety: "/assets/joyandanxiety.jpeg",
      Disgust: "/assets/disgustandjoy.jpeg",
      Angry: "/assets/angerandjoy.jpeg",
    };
    return images[mood] || "/assets/default.jpeg";
  };

  return (
    <>
      {/* <button onClick={fetchQuote}>Get Quote</button> */}

      <Image src={chooseImg()} width={300} height={300} alt="mood" />
      <div className="bg-white bg-opacity-50 rounded-2xl shadow p-6 mb-8 ">
        <p>{quote}</p>
      </div>
      <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700">
        Thanks, I feel better.
      </button>
      <button
        onClick={() => setOpenSpotify(true)}
        className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700"
      >
        Meh, I still feel the same.
      </button>
      {openSpotify && <SpotifyPage />}
    </>
  );
}
