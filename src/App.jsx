import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SortingProvider } from "./context/SortingContext";
import SortingPage from "./pages/SortingLayout/SortingPage";
import Login from "./pages/Login/Login";                       
import AdminLayout from "./admin/Layout/AdminLayout";
import UsersPage from "./admin/components/User/UsersPage";
import AddUser from "./admin/components/AddUser/AddUser";
import EditUser from "./admin/components/EditUser/EditUser";

function App() {
  return (
    <SortingProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SortingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="users" element={<UsersPage />} />
            <Route path="add-user" element={<AddUser />} />
            <Route path="edit-user" element={<EditUser />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SortingProvider>
  );
}

export default App;