import React, { useEffect } from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "./context/userContext";
import MoodEntries from "./MoodEntries";
import MoodHistory from "./MoodHistory";
import QouteWindow from "./QouteWindow.js";
export default function Home() {
  const [emotions, setEmotions] = useState([]);
  const [openAi, setOpenAi] = useState(false);
  const [mood, setMood] = useState("");
  const [journal, setJournal] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const { logout, user, setUser } = useUser();

  let emotionsArray = [
    { img: "/assets/happy.jpeg", name: "Happy" },
    { img: "/assets/sad.jpeg", name: "Sad" },
    { img: "/assets/ennui.jpeg", name: "Ennui" },
    { img: "/assets/anger.jpeg", name: "Angry" },
    { img: "/assets/disgust.jpeg", name: "Disgust" },
    { img: "/assets/anxiety.jpeg", name: "Anxious" },
  ];

  useEffect(() => {
    setEmotions(emotionsArray);
  }, []);

  const addMoodEntry = async (moodEntry) => {
    try {
      setOpenAi(true);
      setMood(moodEntry);
      const { email } = user;
      const res = await fetch("/api/addMood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, moodEntry, user }),
      });
      const data = await res.json();
      if (res.OK) {
        console.log("response", res);
        Router.push("/QouteWindow");
      }
    } catch (e) {
      console.log("Error in saving mood!", e);
    }
  };

  const saveJournal = async () => {
    console.log("user value", user);
    const { email } = user;
    const res = await fetch("/api/addJournal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, journal, user }),
    });
    const data = await res.json();

    if (res.status == 201) {
      console.log("inside");
      setJournal("");
      console.log("response", res);
    }
  };

  return (
    <div className="bg-[url('/assets/moods.jpeg')] min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-6 bg-opacity-50">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-white">MoodTracker 🌈</h1>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
          >
            Logout
          </button>
        </div>
        <div className="flex justify-center gap-4 mb-6">
          <Link href="/MoodHistory">
            <button className="bg-white text-indigo-700 font-semibold px-4 py-2 rounded-xl hover:bg-indigo-100 shadow">
              Mood History
            </button>
          </Link>

          <Link href="/MoodEntries">
            <button className="bg-white text-indigo-700 font-semibold px-4 py-2 rounded-xl hover:bg-indigo-100 shadow">
              Journal Entries
            </button>
          </Link>
        </div>
        <>
          <div className="bg-white bg-opacity-50 rounded-2xl shadow p-6 mb-8 ">
            <>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Hi {user?.name}! How are you feeling today?
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {emotions.map((mood) => (
                  <div className="display:flex flex-direction:column">
                    <div>
                      <Image
                        src={mood.img}
                        width={100}
                        height={100}
                        alt="mood"
                      />
                    </div>
                    <button
                      key={mood.name}
                      className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium py-2 px-4 rounded-xl"
                      onClick={() => addMoodEntry(mood.name)}
                    >
                      {mood.name}
                    </button>
                  </div>
                ))}
              </div>
            </>
          </div>
          {/* Quote Card */}
          {/* <div className="bg-white rounded-2xl shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Your Quote
            </h2>
            <p className="text-lg italic text-gray-600">
              "The best way to predict the future is to create it."
            </p>
          </div> */}
          {/* Mood Journal */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Mood Journal
            </h2>
            <textarea
              placeholder="Write how you feel..."
              className="w-full p-4 border border-gray-300 rounded-xl resize-none h-32 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              onChange={(e) => {
                setJournal(e.target.value);
              }}
              value={journal}
            ></textarea>
            <button
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700"
              onClick={() => saveJournal()}
            >
              Save Entry
            </button>
          </div>
        </>
      </div>
    </div>
  );
}
