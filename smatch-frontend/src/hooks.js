import { useState, useEffect, useContext } from "react";

import UserContext from "./UserContext";

const API_URL = "http://localhost:5000/";

export function useAPIGet(path) {
  const { token } = useContext(UserContext);
  const [ response, setResponse ] = useState();

  const refresh = async () => {
    const resp = await fetch(`${API_URL}${path}`, {
      headers: token ? { "Authorization": `Bearer ${token}` } : {}
    });

    setResponse(resp);
  }

  useEffect(async () => {
    await refresh();
  }, [token, path]);

  return { response, refresh };
}

export function useAPIPost(path) {
  const { token } = useContext(UserContext);

  const sendRequest = async (data) => {
    const resp = await fetch(`${API_URL}${path}`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json", ...(token ? { "Authorization": `Bearer ${token}` } : {}) }
    });

    return resp;
  }

  return sendRequest;
}

export function useAPIJson(data) {
  const [ jsonData, setJsonData ] = useState();

  useEffect(async () => {
    if (data) {
      if (!data.bodyUsed) {
        setJsonData(await data.json());
      }
    } else {
      setJsonData(undefined);
    }
  }, [data]);

  return { jsonData };
}

export function useTopics() {
  const { response } = useAPIGet("topics");
  const { jsonData } = useAPIJson(response);
  
  return jsonData;
}

export function useSignUp() {
  const [ isSuccessful, setIsSuccessful ] = useState();
  const [ error, setError ] = useState();
  const sendRequest = useAPIPost("signup");

  const trySignUp = async (username, password) => {
    const response = await sendRequest({ username, password });
    
    if (response.status >= 200 && response.status <= 299) {
      setIsSuccessful(true);
      setError(undefined);
    } else {
      setIsSuccessful(false);
      setError(response.status ? "Username or password already taken" : "Error contacting server");
    }
  };

  return { isSuccessful, error, trySignUp };
}

export function useLogin() {
  const [ isSuccessful, setIsSuccessful ] = useState();
  const [ error, setError ] = useState();
  const sendRequest = useAPIPost("login");
  const { setToken } = useContext(UserContext);

  const tryLogin = async (username, password) => {
    const response = await sendRequest({ username, password });
    
    if (response.status >= 200 && response.status <= 299) {
      setIsSuccessful(true);
      setError(undefined);

      const body = await response.json();
      setToken(body.token);
    } else {
      setIsSuccessful(false);
      setError(response.status ? "Wrong username or password" : "Error contacting server");
    }
  };

  return { isSuccessful, error, tryLogin };
}

export function useThreads() {
  const { response } = useAPIGet("threads");
  const { jsonData } = useAPIJson(response);

  return jsonData;
}

export function useThread(id) {
  const { response, refresh } = useAPIGet(`threads/${id}`);
  const { jsonData } = useAPIJson(response);

  return { thread: jsonData, refresh };
}

export function useCreateReply(thread_id) {
  const sendRequest = useAPIPost(`threads/${thread_id}/replies`);

  return sendRequest;
}

export function useUserCount(id) {
  const { response } = useAPIGet("user_count");
  const { jsonData } = useAPIJson(response);

  return jsonData;
}

export function useCreateThread() {
  const sendRequest = useAPIPost("threads");

  return sendRequest;
}

export function useVisualization(name) {
  const { response } = useAPIGet(`visualization/${name}`);
  const { jsonData } = useAPIJson(response);

  return jsonData;
}

export function useCurrentUser() {
  const { response, refresh } = useAPIGet("current_user");
  const { jsonData } = useAPIJson(response);

  return { currentUser: jsonData, refresh };
}

export function useUpdateUsername() {
  const sendRequest = useAPIPost("current_user");

  return sendRequest;
}
