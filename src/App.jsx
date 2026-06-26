import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SortingProvider } from "./context/SortingContext";
import { AdminProvider } from "./context/AdminContext";
import SortingPage from "./pages/SortingLayout/SortingPage";
import Login from "./pages/Login/Login";
import AdminLayout from "./admin/Layout/AdminLayout";
import UsersPage from "./admin/components/User/UsersPage";
import AddUser from "./admin/components/AddUser/AddUser";
import EditUser from "./admin/components/EditUser/EditUser";
import AlgorithmsPage from "./admin/components/Algorithms/AlgorithmsPage";
import AddAlgorithm from "./admin/components/Algorithms/AddAlgorithm";
import EditAlgorithm from './admin/components/Algorithms/EditAlgorithm';
import AdminRoute from "./admin/components/Route/AdminRoute";
import Forbidden from "./pages/Forbidden/Forbidden";
import Register from "./pages/Register/Register";
function App() {
  return (
    <BrowserRouter>
      <SortingProvider>
        <Routes>
          <Route path="/" element={<SortingPage />} />
          <Route path="/:algorithmSlug" element={<SortingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/403" element={<Forbidden />} />
          <Route path="/admin" element={
            <AdminRoute>
              <AdminProvider>
                <AdminLayout />
              </AdminProvider>
            </AdminRoute>
          }>
            <Route path="users" element={<UsersPage />} />
            <Route path="add-user" element={<AddUser />} />
            <Route path="edit-user/:id" element={<EditUser />} />
            <Route path="algorithms" element={<AlgorithmsPage />} />
            <Route path="add-algorithm" element={<AddAlgorithm />} />
            <Route path="edit-algorithm/:id" element={<EditAlgorithm />} />

          </Route>
        </Routes>
      </SortingProvider>
    </BrowserRouter>
  );
}

export default App;
