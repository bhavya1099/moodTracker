// export default async function handler(req, res) {
//   const { code } = req.body;
//   const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
//   const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
//   const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;

//   const creds = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

//   const response = await fetch("https://accounts.spotify.com/api/token", {
//     method: "POST",
//     headers: {
//       Authorization: `Basic ${creds}`,
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//     body: new URLSearchParams({
//       grant_type: "authorization_code",
//       code,
//       redirect_uri: redirectUri,
//     }),
//   });

//   const data = await response.json();
//   res.status(200).json(data);
// }

// pages/api/getAccessToken.js
export default async function handler(req, res) {
  const { code, verifier } = req.body;

  const client_id = "";
  const redirect_uri = "http://localhost:3000/callback";

  const params = new URLSearchParams();
  params.append("client_id", client_id);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirect_uri);
  params.append("code_verifier", verifier); // or use localStorage if not cookie
  console.log("verifier", verifier);
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  const data = await response.json();
  res.status(200).json(data);
}
