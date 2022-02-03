import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import UserContext from "./UserContext";
import MatchContext from "./MatchContext";

function App() {
  const [ token, setToken ] = useState();
  const [ matches, setMatches ] = useState([]);
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

  const pushMatch = (match) => {
    const newMatches = [ match, ...matches ];
    setMatches(newMatches);
    window.localStorage.setItem("matches", JSON.stringify(newMatches));
  };

  useEffect(() => {
    if (!token) {
      const savedToken = window.localStorage.getItem("token");

      if (savedToken) {
        setToken(savedToken);
      } else {
        navigate("/login");
      }
    }

    if (!matches.length) {
      const savedMatches = window.localStorage.getItem("matches");
      setMatches(JSON.parse(savedMatches));
    }
  }, []);

  return (
    <UserContext.Provider value={{ token, setToken: setAndSaveToken, clearToken }}>
      <MatchContext.Provider value={{ matches, pushMatch }}>
        <Outlet />
      </MatchContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
