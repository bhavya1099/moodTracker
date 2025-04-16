import { useEffect, useState } from "react";
import { useUser } from "./context/userContext";

export default function MoodEntries() {
  const { logout, user } = useUser();
  const [journals, setJournals] = useState([]);

  const getJournalEntries = async () => {
    const res = await fetch("/api/getJournal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, user: user }),
    });

    const data = await res.json();
    setJournals(data.content || []);
  };

  useEffect(() => {
    getJournalEntries();
  }, []);

  return (
    <div className="bg-gradient-to-b from-blue-50 to-indigo-100 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Journal List */}
        {journals.length === 0 ? (
          <p className="text-gray-600 text-lg">No journal entries found.</p>
        ) : (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {journals.map((journal, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-xl p-4 border border-indigo-100"
              >
                <p className="text-gray-700 text-base mb-2">
                  {journal.content}
                </p>
                <p className="text-sm text-gray-400">
                  {new Date(journal.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
