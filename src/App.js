import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
