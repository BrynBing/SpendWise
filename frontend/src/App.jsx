import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SecurityQuestions from "./pages/SecurityQuestions";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import Signup from "./pages/Signup";
import Expense from "./pages/Expense";
import Schedule from "./pages/Schedule";
import Goals from "./pages/Goals";
import Reports from "./pages/Reports";
import Achievements from "./pages/Achievements";
import Settings from "./pages/Settings";
import DashboardLayout from "./components/DashboardLayout";
import Suggestions from "./pages/Suggestions";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <BrowserRouter>
      <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/security-questions" element={<SecurityQuestions />} />
          {/* Dashboard and related pages wrapped in the layout */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/expense" element={<Expense />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/suggestions" element={<Suggestions />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
