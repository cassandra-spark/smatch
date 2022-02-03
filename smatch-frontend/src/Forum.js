import React from "react"
import { Link } from "react-router-dom";

import Title from "./components/Title";
import { ReactComponent as PlusIcon} from "./icons/plus-circle.svg";
import { ReactComponent as ForumIcon} from "./icons/forum.svg";
import { useThreads, useUserCount } from "./hooks";

export default function Forum() {
  const threads = useThreads();
  const userCount = useUserCount();

  return (
    <div className="flex flex-col items-center flex-1">
      <Title subtitle={`${userCount?.count || 0} Members`}>
        Forum
      </Title>

      <div className="w-full max-w-xl flex flex-col px-4 py-8 gap-4 relative">
        <Link to="/forum/new">
          <PlusIcon className="absolute sm:top-2 sm:-right-2 top-[-12px] right-4 fill-amber-500 w-10 h-10" />
        </Link>

        {threads ?
          threads.map((thread) => (
            <Link key={thread.id} to={`/forum/${thread.id}`} className="bg-gray-900 rounded-[50px] p-3 grid grid-cols-5 gap-2 items-center">
              <div className="col-span-1 w-full aspect-square flex items-center justify-center">
                <ForumIcon className="h-10 w-10 fill-gray-300" />
              </div>

              <div className="flex flex-col h-full text-white col-span-4 h-full px-4">
                <div className="flex-1 flex flex-col">
                  <span>{thread.username} • {thread.category}</span>
                  <h3 className="text-2xl">{thread.title}</h3>
                </div>
                <div className="flex justify-between">
                  <span>{thread.replies} {thread.replies == 1 ? "Reply" : "Replies"}</span>
                  <span>{thread.last_reply_on}</span>
                </div>
              </div>
            </Link>
          )) :
          <></>
        }
      </div>
    </div>
  )
}
