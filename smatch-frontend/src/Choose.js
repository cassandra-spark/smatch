import React from "react"
import { Link } from "react-router-dom";

import Title from "./components/Title";

const matches = [
  { id: 1, title: "Russian for Beginners", match: 1.0 },
  { id: 2, title: "Russian Language for ...", match: 0.95 },
  { id: 3, title: "Russian Basics", match: 0.92 },
  { id: 4, title: "Start Speaking Russian", match: 0.90 },
  { id: 5, title: "Something in Russian", match: 0.88 },
];

export default function Choose() {
  return (
    <div className="flex flex-col items-center flex-1">
      <Title>
        Choose Your Matches!
      </Title>

      <div className="w-full max-w-xl grid grid-cols-1 px-4 py-8 gap-4">
        {matches.map((match) => (
          <Link key={match.id} className="flex items-center justify-between bg-amber-600 rounded-full p-4" style={{ width: `${match.match * 100}%` }} to="/course">
            <span className="text-white">{match.title}</span>
            <span className="text-white">{match.match * 100}%</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
