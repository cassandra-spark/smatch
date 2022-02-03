import { createContext } from "react";

const MatchContext = createContext({ matches: [], pushMatch: () => {} });

export default MatchContext;
