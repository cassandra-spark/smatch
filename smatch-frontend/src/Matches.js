import React from "react"
import { Link } from "react-router-dom";

import { ReactComponent as TranslateIcon } from "./icons/translate.svg";

import Title from "./components/Title";

export default function Matches() {
  return (
    <div className="flex flex-col flex-1">
      <Title>
        It's a Match!
      </Title>

      <div className="w-full flex flex-col items-center flex-1 px-4 py-8">
        <Link className="w-full max-w-xl flex flex-col items-center justify-center flex-1 bg-gray-900 rounded-[50px]" to="/choose">

          <div className="flex flex-col items-center justify-center gap-4">
            <TranslateIcon className="fill-amber-500 w-32 h-32" />

            <h2 className="text-amber-500 text-center text-2xl px-8 py-4">Tap to see more</h2>
          </div>

        </Link>
      </div>
    </div>
  )
}
