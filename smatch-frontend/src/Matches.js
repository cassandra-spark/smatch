import React, { useContext } from "react"
import { Link } from "react-router-dom";

import Title from "./components/Title";
import MatchContext from "./MatchContext";

export default function Matches() {
  const { matches } = useContext(MatchContext);

  const lastMatch = matches.length > 0 ? matches[0] : undefined;

  return (
    <div className="flex flex-col items-center flex-1">
      <Title>
        { lastMatch ? "It's a Match!" : "You have no matches yet!" }
      </Title>

      { lastMatch ?
          <div className="w-full max-w-xl grid grid-cols-1 px-4 py-8 gap-4">
            { lastMatch.map((course) => (
              <Link key={course.course_id} className="flex items-center justify-between bg-amber-800 rounded-full px-6 py-4" to={`/course/${course.course_id}`}>
                <span className="text-white">{course.subject}</span>
              </Link>
            )) }
          </div> :
          <div className="w-full max-w-3xl mt-8 rounded-3xl text-white bg-gray-900 px-6 py-4 flex">
            <Link to="/" className="bg-amber-700 hover:bg-amber-600 rounded-full px-4 py-2 flex-1 text-center">Explore topics and skills</Link>
          </div>
      }
    </div>
  )
}
