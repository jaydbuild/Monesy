import ExpenseTracker from "./Components/ExpenseTracker";
import WelcomeScreen from "./Components/WelcomeScreen"; // (for future)
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { getUserType } from "./storage"; // (for future)

function App() {
  // const userType = getUserType();  (for future)

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E3E6E7]">
      <Router>
        <Routes>
          <Route path="/" element={<ExpenseTracker />} />
          <Route path="/dashboard" element={<ExpenseTracker />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
