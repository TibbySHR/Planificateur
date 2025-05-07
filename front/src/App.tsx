import Main from "./pages/Main";
import { Routes, Route } from "react-router-dom";
import AdvancedSearch from "./components/AdvancedSearch/AdvancedSearch";
import Navbar from "./components/Navbar/Navbar";
import SchoolProvider from "./store/providers/SchoolProvider";

function App() {
  return (
    <SchoolProvider>
      <Navbar />
      <Routes>
        <Route
          path="/:programId?/:name?/:code?/:segments?"
          element={<Main />}
        ></Route>
        <Route path="/advancedSearch" element={<AdvancedSearch />}></Route>
      </Routes>
    </SchoolProvider>
  );
}

export default App;
