import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
// import AdminPage from './pages/AdminPage';
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./Components/ProtectedRoutes";
import AuthProvider from "./Context/AuthContext";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
// import DashboardLayout from './Components/DashboardLayout';
import ErrorBoundary from "./Context/ErrorBoundry";
import "bootstrap/dist/css/bootstrap.min.css";
import MockupDetailsPage from "./Components/MockupDetailsPage";

const App = () => {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route element={<ProtectedRoute roles={"ADMIN"} />}>
              {/* Uncomment and use this route if you have an AdminPage component */}
              <Route path="/admin" element={<Dashboard />} />

              {/* <Route path="/admin" element={<ProtectedRoute roles="ADMIN"><AdminDashboard /></ProtectedRoute>} /> */}
            </Route>
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/mockup/:id" element={<MockupDetailsPage />} />{" "}
            <Route path="*" element={<NotFound />} />
            {/* Add route for MockupDetailsPage */}
            {/* <Route path="/temp" element={<DashboardLayout />} /> */}
          </Routes>
        </BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          // transition={Bounce}
        />
      </ErrorBoundary>
    </AuthProvider>
  );
};
export default App;
