import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import UserContext from "./UserContext";

function App() {
  const [ token, setToken ] = useState();
  const navigate = useNavigate();

  const setAndSaveToken = (newToken) => {
    setToken(newToken);
    window.localStorage.setItem("token", newToken);
  };

  const clearToken = () => {
    setToken(undefined);
    window.localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    if (token) return;

    const savedToken = window.localStorage.getItem("token");

    if (savedToken) {
      setToken(savedToken);
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <UserContext.Provider value={{ token, setToken: setAndSaveToken, clearToken }}>
      <Outlet />
    </UserContext.Provider>
  );
}

export default App;
