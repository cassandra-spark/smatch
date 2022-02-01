import React, { useState, useEffect, useContext } from "react"

import UserContext from "./UserContext";
import { ReactComponent as PencilIcon } from "./icons/pencil.svg";
import { useCurrentUser, useUpdateUsername } from "./hooks";

export default function Settings() {
  //const [ enabled, setEnabled ] = useState(false)
  const [ isEditing, setIsEditing ] = useState(false);
  const [ newUsername, setNewUsername ] = useState("");
  const { clearToken } = useContext(UserContext);
  const { currentUser, refresh } = useCurrentUser();
  const updateUsername = useUpdateUsername();
  
  useEffect(() => {
    if (!currentUser) return;
    
    setNewUsername(currentUser.username);
  }, [currentUser]);

  const submitForm = async () => {
    await updateUsername({ username: newUsername });
    refresh();
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col flex-1 gap-8 p-8">
      <div className="flex items-center text-white gap-6">
        <img src="https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg" className="col-span-1 h-20 border-2 border-amber-600 aspect-square rounded-full object-cover" />
        { isEditing ?
          <div className="flex gap-4 w-full">
            <input type="text" className="flex-1 rounded-lg px-4 py-2 text-black" placeholder="Username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
            <button className="bg-amber-700 hover:bg-amber-600 rounded-lg px-6 py-2 text-base font-medium" onClick={() => submitForm()}>Save</button>
          </div> :
          <>
            <h3 className="text-3xl flex-1">{ currentUser ? currentUser.username : "..." }</h3>
            <button className="p-2" onClick={() => setIsEditing(true)}>
              <PencilIcon className="fill-amber-500 w-8 h-8" />
            </button>
          </>
        }
      </div>
      
      <div className="rounded-3xl text-white bg-gray-900 px-6 py-4">
        <h3 className="text-amber-600 text-xl">Previous Matches</h3>
        <ul className="mt-2">
          <li>Russian Basic</li>
          <li>Machine Learning</li>
          <li>IT 101 for Beginners</li>
        </ul>
      </div>

      {/*<div className="rounded-3xl text-white bg-gray-900 px-6 py-4">
        <div className="flex justify-between">
          <h3 className="text-amber-600 text-xl">Notifications</h3>

          <button type="button" className={`${enabled ? "bg-amber-600" : "bg-gray-200"}  relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500" role="switch" aria-checked="false`} onClick={() => setEnabled(!enabled)}>
            <span className="sr-only">Use setting</span>
            <span aria-hidden="true" className={`${enabled ? "translate-x-5" : "translate-x-0"} pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}></span>
          </button>
        </div>
      </div>*/}

      <div className="rounded-3xl text-white bg-gray-900 px-6 py-4 flex">
        <button className="bg-amber-700 hover:bg-amber-600 rounded-full px-4 py-2 flex-1" onClick={() => clearToken()}>Sign Out</button>
      </div>
    </div>
  )
}
