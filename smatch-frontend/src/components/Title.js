import React from "react"
import { Link } from "react-router-dom";

import { ReactComponent as ChevronLeftIcon } from "../icons/chevron-left-circle.svg";

export default function Title({ children, subtitle, backTo }) {
  return (
    <div className="bg-amber-700 rounded-b-full min-w-full px-12 pt-8 pb-6 relative">
      {backTo ? (
        <Link to={backTo}>
          <ChevronLeftIcon className="absolute top-4 left-4 fill-white w-8 h-8" />
        </Link>
      ) : <></>}
      <h1 className="text-white text-2xl text-center">{ children }</h1>
      { subtitle ? (
        <span className="block mt-4 text-gray-200 text-lg text-center">{ subtitle }</span>
      ) : <div className="pb-4"></div> }
    </div>
  )
}
