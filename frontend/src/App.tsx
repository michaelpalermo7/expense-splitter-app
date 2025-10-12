import { Route, Routes } from "react-router-dom";
import "./App.css";
import GroupListPage from "./pages/Groups/GroupListPage";
import GroupAddPage from "./pages/Groups/GroupAddPage";

import "./index.css";
import GroupInfoPage from "./pages/GroupDetail/GroupInfoPage";
import MemberAddPage from "./pages/GroupDetail/MemberAddPage";
import SettlementAddPage from "./pages/GroupDetail/SettlementAddPage";
import ExpenseAddPage from "./pages/GroupDetail/ExpenseAddPage";

function App() {
  return (
    <Routes>
      {/* http://localhost:5173 */}
      <Route path="/" element={<GroupListPage />} />

      <Route path="/groups" element={<GroupListPage />} />

      <Route path="/add-group" element={<GroupAddPage />} />

      <Route path="/group-info/:id" element={<GroupInfoPage />} />

      <Route path="/add-member/:id" element={<MemberAddPage />} />
      <Route path="/add-settlement/:id" element={<SettlementAddPage />} />
      <Route path="/add-expense/:id" element={<ExpenseAddPage />} />
    </Routes>
  );
}

export default App;
