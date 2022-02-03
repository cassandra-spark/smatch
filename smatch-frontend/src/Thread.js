import React, { useState } from "react"
import { Link, useParams } from "react-router-dom";

import Title from "./components/Title";
import { ReactComponent as ReplyIcon} from "./icons/reply.svg";
import { useThread, useCreateReply } from "./hooks";

export default function Thread() {
  const { thread_id } = useParams();
  const { thread, refresh } = useThread(thread_id);

  const [ body, setBody ] = useState("");
  const createReply = useCreateReply(thread_id);

  const submitForm = async () => {
    if (!body) return;

    await createReply({ body });
    setBody("");
    refresh();
  };

  return thread ? (
    <div className="flex flex-col items-center flex-1">
      <Title subtitle={`${thread.username} • ${thread.category}`} backTo="/forum">
        {thread.title}
      </Title>

      <div className="w-full max-w-2xl flex flex-col px-4 py-8 gap-4 relative">
        <div className="bg-gray-900 rounded-[50px] p-6 grid gap-2 items-center">
          <p className="text-gray-200 px-2 py-2 rounded-lg">
            {thread.body}
          </p>

          <div className="flex justify-end text-white px-4">
            <span>{thread.created_on}</span>
          </div>
        </div>

        {thread.replies.map((reply) => (
          <div key={reply.id} className="bg-gray-900 rounded-[50px] p-6 grid gap-2 items-center">
            <div className="flex gap-4 items-center">
              <div className="col-span-1 aspect-square flex items-center justify-center">
                <ReplyIcon className="h-10 w-10 fill-gray-300" />
              </div>
              <span className="text-white">{reply.username}</span>
            </div>

            <p className="text-gray-200 px-2 py-2 rounded-lg">
              {reply.body}
            </p>

            <div className="flex justify-end text-white px-4">
              <span>{reply.created_on}</span>
            </div>
          </div>
        ))}

        <div className="bg-gray-900 rounded-[50px] p-6 grid gap-2 items-center">
          <div className="flex gap-4 items-center">
              <div className="col-span-1 aspect-square flex items-center justify-center">
                <ReplyIcon className="h-10 w-10 fill-gray-300" />
              </div>
            <span className="text-white">you</span>
          </div>

          <div className="p-2">
            <textarea className="rounded-lg w-full h-20 px-4 py-2" value={body} onChange={(e) => setBody(e.target.value)} />
          </div>

          <div className="flex justify-end text-white px-4">
            <button className="bg-amber-700 hover:bg-amber-600 rounded-lg px-6 py-2 text-base font-medium" onClick={() => submitForm()}>Post</button>
          </div>
        </div>
      </div>
    </div>
  ) : <></>;
}
