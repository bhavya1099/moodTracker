// src/pages/SpotifyPage.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const SpotifyPage = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [tracks, setTracks] = useState([]);
  const router = useRouter();
  console.log("access token value", accessToken);
  useEffect(() => {
    console.log("use effect is called");
    const code = new URLSearchParams(window.location.search).get("code");
    if (code && !accessToken) {
      console.log("fetch access token is called");
      fetchAccessToken(code).then(() => {
        // ✅ Clean the URL so fetchAccessToken won't run again
        const cleanUrl = window.location.origin + router.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      });
    }
  }, []);

  async function redirectToSpotify() {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams({
      client_id: "",
      response_type: "code",
      redirect_uri: "http://localhost:3000/callback", // Make sure this matches your Spotify app settings
      scope: "user-read-private user-read-email user-library-read",
      code_challenge_method: "S256",
      code_challenge: challenge,
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  function generateCodeVerifier(length) {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
    let verifier = "";
    for (let i = 0; i < length; i++) {
      verifier += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return verifier;
  }

  async function generateCodeChallenge(codeVerifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest("SHA-256", data);
    const base64Digest = btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, ""); // Base64url encoding
    return base64Digest;
  }

  const fetchAccessToken = async (code) => {
    const verifier = localStorage.getItem("verifier");
    const response = await fetch("/api/getAccessToken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, verifier }),
    });
    const data = await response.json();
    console.log("data from access token api", data);
    setAccessToken(data.access_token);
  };

  const fetchSongsByGenre = async (genre) => {
    const res = await fetch(
      `https://api.spotify.com/v1/search?q=genre:${genre}&type=track&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await res.json();
    console.log("fetch songs by genre", data);
    setTracks(data.tracks.items);
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Spotify Mood Songs 🎵</h1>

      {!accessToken ? (
        <button
          onClick={redirectToSpotify}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Connect to Spotify
        </button>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter genre (e.g., pop, jazz, chill)"
            onKeyDown={(e) => {
              if (e.key === "Enter") fetchSongsByGenre(e.target.value);
            }}
            className="text-black p-2 rounded"
          />
          <ul className="mt-4">
            {tracks.map((track) => (
              <li key={track.id}>
                {track.name} by {track.artists[0].name}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default SpotifyPage;
