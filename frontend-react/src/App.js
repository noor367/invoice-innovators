import './App.css';
import LoginPage from "./pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UploadPage from "./pages/Upload";
import CreatePage from "./pages/Create";
import ViewPage from "./pages/View";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/upload" element={<UploadPage />} />
        <Route path="/dashboard/create" element={<CreatePage />} />
        <Route path="/dashboard/view" element={<ViewPage />} />
        {/* Define other routes here */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
