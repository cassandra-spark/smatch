import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Title from "./components/Title";
import { useTopics, useCreateThread } from "./hooks";

export default function NewThread() {
  const topics = useTopics();
  const [ title, setTitle ] = useState("");
  const [ category, setCategory ] = useState("");
  const [ body, setBody ] = useState("");
  const createThread = useCreateThread();
  const [ error, setError ] = useState()
  const navigate = useNavigate();

  const submitForm = async () => {
    if (!title || !category || !body) {
      setError("Please fill in all the fields");
      return;
    }

    const resp = await createThread({ title, category, body });

    if (resp.status >= 200 && resp.status < 300) {
      const respJson = await resp.json();
      navigate(`/forum/${respJson.thread_id}`);
    } else {
      setError("There was an error creating the thread. Please try again later");
    }
  };

  return (
    <div className="flex flex-col items-center flex-1">
      <Title backTo="/forum">
        Create a New Thread
      </Title>

      <div className="w-full max-w-xl grid grid-cols-1 px-8 py-8 gap-6 relative">
        <input type="text" className="rounded-lg px-4 py-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />

        <select className="rounded-lg px-3 py-2" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>Select category</option>
          { topics ? (
              topics.map((topic) => <option key={topic || "Other"} value={topic || "Other"}>{ topic || "Other" }</option>)
            ) :
            <></>
          }
        </select>

        <textarea className="rounded-lg h-20 px-4 py-2" placeholder="Body" value={body} onChange={(e) => setBody(e.target.value)} />
      </div>

      <div className="flex flex-col justify-center text-white px-8 gap-4">
        { error ? <span className="text-red-500">{ error }</span> : <></> }
        <button className="bg-amber-700 hover:bg-amber-600 rounded-lg px-6 py-2 text-base font-medium" onClick={() => submitForm()}>Create Topic</button>
      </div>
    </div>
  );
}
