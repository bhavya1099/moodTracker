// pages/callback.js
import { useEffect } from "react";
import { useRouter } from "next/router";

// export default function Callback() {
//   const router = useRouter();

//   useEffect(() => {
//     const code = router.query.code;

//     if (code) {
//       // You can send this code to your backend or use it to get the access token
//       console.log("Authorization Code:", code);
//       // TODO: fetch access token and redirect to SpotifyPage or home
//       router.push("/SpotifyPage"); // Redirect to your Spotify page after success
//     }
//   }, [router]);

//   return <p>Handling Spotify Redirect...</p>;
// }

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (code) {
      router.push(`/SpotifyPage?code=${code}`);
    }
  }, []);

  return <p>Redirecting...</p>;
}
