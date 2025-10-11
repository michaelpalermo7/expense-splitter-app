import { Route, Routes } from "react-router-dom";
import "./App.css";
import GroupListPage from "./pages/Groups/GroupListPage";
import GroupAddPage from "./pages/Groups/GroupAddPage";

import "./index.css";
import GroupInfoPage from "./pages/GroupDetail/GroupInfoPage";
import MemberAddPage from "./pages/GroupDetail/MemberAddPage";

function App() {
  return (
    <Routes>
      {/* http://localhost:5173 */}
      <Route path="/" element={<GroupListPage />} />

      <Route path="/groups" element={<GroupListPage />} />

      <Route path="/add-group" element={<GroupAddPage />} />

      <Route path="/group-info/:id" element={<GroupInfoPage />} />

      <Route path="/add-member" element={<MemberAddPage />} />
    </Routes>
  );
}

export default App;
