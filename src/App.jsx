import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthPage from "./Auth/AuthPage/authForm";
import FirstTimePassword from "./Auth/FirstTimePassword/FirstTimePassword";
import Layout from "./components/Layout";
import ProfilePage from "./Pages/ProfilePage";
import DashboardRoutes from "./dashboard/routes";
import AuthProvider from "./context/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles/variables.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Navigate to="/dashboard/documents" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/first-time-password"
              element={
                <ProtectedRoute>
                  <FirstTimePassword />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            {/* Dashboard routes */}
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <DashboardRoutes />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
