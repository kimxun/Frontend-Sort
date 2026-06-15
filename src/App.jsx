import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import SortingPage from "./pages/SortingPage";

import AdminLayout from "./admin/Layout/AdminLayout";

import UsersPage from "./admin/components/User/UsersPage";
import AddUser from "./admin/components/AddUser/AddUser";
import EditUser from "./admin/components/EditUser/EditUser";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* USER */}

        <Route
          path="/"
          element={<SortingPage />}
        />

        {/* ADMIN */}

        <Route
          path="/admin"
          element={<AdminLayout />}
        >

          <Route
            path="users"
            element={<UsersPage />}
          />
          <Route
            path="add-user"
            element={<AddUser />}
          />
          <Route
            path="edit-user"
            element={<EditUser />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;