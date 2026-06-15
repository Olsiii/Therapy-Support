import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar";

import Login from "./pages/login";
import Register from "./pages/register";
  import Dashboard from "./pages/dashbord";
import MoodTracker from "./pages/moodtracker";
import Journal from "./pages/journal";
import Habits from "./pages/habits";
import EmergencySupport from "./pages/emergencysupport";
import Disclaimer from "./pages/disclaimer";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/mood-tracker" element={<MoodTracker />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/emergency-support" element={<EmergencySupport />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;