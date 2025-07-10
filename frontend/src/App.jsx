import { Toaster } from "sonner";

import Router from "./router";
import Layout from "./layout";

function App() {
  return (
    <Layout>
      <Toaster />
      <Router />
    </Layout>
  );
}

export default App;
