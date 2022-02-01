import { createContext } from "react";

const UserContext = createContext({ token: undefined, setToken: () => {}, clearToken: () => {} });

export default UserContext;
