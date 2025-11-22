import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Home from "./pages/Home";
import Places from "./pages/Places";
import Recommend from "./pages/Recommend";
import MyCourses from "./pages/MyCourses";
import Favorites from "./pages/Favorites";
import CourseEdit from "./pages/CourseEdit";
import CourseDetail from "./pages/CourseDetail";
import PlaceDetail from "./pages/PlaceDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/places" element={<Places />} />
            <Route path="/recommend" element={<Recommend />} />
            <Route
              path="/my-courses"
              element={
                <ProtectedRoute>
                  <MyCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course/new"
              element={
                <ProtectedRoute>
                  <CourseEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course/:courseId/edit"
              element={
                <ProtectedRoute>
                  <CourseEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course/:courseId/view"
              element={
                <ProtectedRoute>
                  <CourseDetail />
                </ProtectedRoute>
              }
            />
            <Route path="/place/:placeId" element={<PlaceDetail />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
