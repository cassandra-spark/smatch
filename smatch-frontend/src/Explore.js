import React from "react"
import { Link } from "react-router-dom";

import Title from "./components/Title";
import { useTopics } from "./hooks";

export default function Explore() {
  const topics = useTopics();

  return (
    <div className="flex flex-col">
      <Title>
        Explore<br />Topics and Skills
      </Title>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 px-2 py-6">
        {topics ?
          topics.map((topic) => (
            <Link key={topic || "Other"} to={`/match/${encodeURIComponent(topic)}`} className="px-4 py-2 flex items-center justify-center text-center bg-gray-900 text-white rounded-full cursor-pointer">
              { topic || "Other" }
            </Link>
          ))
          : <></>
        }
      </div>
    </div>
  )
}
