import { Route, Routes /*, Navigate */ } from "react-router-dom";
import "./App.css";
import GroupAddPage from "./pages/Groups/GroupAddPage";

import "./index.css";
import GroupInfoPage from "./pages/GroupDetail/GroupInfoPage";
import MemberAddPage from "./pages/GroupDetail/MemberAddPage";
import SettlementAddPage from "./pages/GroupDetail/SettlementAddPage";
import ExpenseAddPage from "./pages/GroupDetail/ExpenseAddPage";

import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/Groups/HomePage";
import GroupSharePage from "./pages/GroupDetail/GroupSharePage";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-xl lg:max-w-2xl min-h-screen bg-white shadow-md overflow-x-hidden flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/add-group" element={<GroupAddPage />} />

            <Route path="/group/:token" element={<GroupInfoPage />} />
            <Route path="/add-member/:token" element={<MemberAddPage />} />
            <Route
              path="/add-settlement/:token"
              element={<SettlementAddPage />}
            />
            <Route path="/add-expense/:token" element={<ExpenseAddPage />} />

            <Route path="/group/:token/share" element={<GroupSharePage />} />
          </Routes>
        </main>
        <div className="mt-6">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
