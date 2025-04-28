import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "./context/userContext";
import Link from "next/link";

export default function MoodEntries() {
  const { logout, user } = useUser();
  const [journals, setJournals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const entryPerPage = 3;
  const startIdx = (currentPage - 1) * entryPerPage;
  const endIdx = startIdx + entryPerPage;
  const router = useRouter();

  const getJournalEntries = async () => {
    const res = await fetch("/api/getJournal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, user: user }),
    });

    const data = await res.json();
    setJournals(data.content || []);
  };
  const currentItems = journals.slice(startIdx, endIdx);

  useEffect(() => {
    getJournalEntries();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    router.push(`?page=${page}`);
  };

  return (
    <>
      <div className="bg-[url('/assets/moods.jpeg')] min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-6 bg-opacity-50">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-b from-blue-50 to-indigo-100 min-h-screen p-6">
            <Link href="/Home">
              <button className="bg-white text-indigo-700 font-semibold px-4 py-2 rounded-xl hover:bg-indigo-100 shadow">
                Back to Home
              </button>
            </Link>
            <div className="max-w-4xl mx-auto">
              {/* Journal List */}
              {journals.length === 0 ? (
                <p className="text-gray-600 text-lg">
                  No journal entries found.
                </p>
              ) : (
                <>
                  <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    {currentItems.map((journal, index) => (
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
                  <div>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      //disabled={page === 1}
                    >
                      Previous
                    </button>
                    <span>0 / 3</span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      //disabled={courrentPage === pageCount}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
