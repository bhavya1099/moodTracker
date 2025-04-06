import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "./context/userContext";

export default function signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const { setUser } = useUser();
  const [login, setLogin] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/signup", {
        // Use relative API route
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Signup successful! 🎉");
        setEmail("");
        setPassword("");
        //setName("");
        setUser({
          userId: data.userId,
          name: data.userName,
          email: data.email,
        });
        router.push("/Home");
      } else {
        setMessage(data.message || "Signup failed.");
      }
    } catch (err) {
      console.error(err);
      setMessage("An error occurred. Try again.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/login", {
        // Use relative API route
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Login successful! 🎉");
        setEmail("");
        setPassword("");
        setUser({ userId: data.userId, name: data.userName, email: email });
        router.push("/Home");
      } else {
        setMessage(data.message || "Login failed.");
      }
    } catch (err) {
      console.error(err);
      setMessage("An error occurred. Try again.");
    }
  };

  return (
    <div className="bg-[url('/assets/moods.jpeg')] min-h-screen">
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-md mt-10">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">
          Create an Account
        </h2>
        <form onSubmit={!login ? handleSignup : handleLogin}>
          {!login && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Name</label>
              <input
                type="name"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="your-name"
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700"
          >
            {login ? "Login" : "Sign up"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
        )}
        <div> already have an account</div>
        <button
          onClick={() => {
            setLogin(true);
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}
