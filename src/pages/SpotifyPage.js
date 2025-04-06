import React from "react";
import { useEffect, useState } from "react";

export default function SpotifyPage() {
  const [profile, setProfile] = useState(null);
  const clientId = "";

  useEffect(() => {
    const code = getCodeFromURL();

    if (!code) {
      redirectToAuthCodeFlow(clientId);
    } else {
      (async () => {
        const accessToken = await getAccessToken(clientId, code);
        const profileData = await fetchProfile(accessToken);
        setProfile(profileData);
      })();
    }
  }, []);

  function getCodeFromURL() {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    return params.get("code");
  }

  async function redirectToAuthCodeFlow(clientId) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);
    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://localhost:3000/spotify");
    params.append("scope", "user-read-private user-read-email");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  function generateCodeVerifier(length) {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from(crypto.getRandomValues(new Uint8Array(length)))
      .map((x) => possible[x % possible.length])
      .join("");
  }

  async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  async function getAccessToken(clientId, code) {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://localhost:3000/spotify");
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    const { access_token } = await result.json();
    return access_token;
  }

  async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return result.json();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Spotify Profile</h1>
      {!profile && <p>Loading...</p>}
      {profile && (
        <div className="space-y-2">
          <p>
            <strong>Name:</strong> {profile.display_name}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>ID:</strong> {profile.id}
          </p>
          {profile.images?.[0] && (
            <img
              src={profile.images[0].url}
              alt="Avatar"
              width={200}
              height={200}
            />
          )}
        </div>
      )}
    </div>
  );
}
