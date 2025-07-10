import { Routes, Route } from "react-router-dom";
import PhonePage from "../pages/PhonePage";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<PhonePage />} />
    </Routes>
  );
}

export default Router;
