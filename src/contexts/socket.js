import { createContext } from "react";

// Not really necessary (could useRef instead),
// but this will keep it consistent with the client app.
// Also it will make it easier to scale
const socketContext = createContext(null);

export default socketContext;
