import { Suspense } from "react";
import Car from "../features/car/Car";
import Client from "../features/client/Client";
import { ClientDetail } from "../features/client/ClientDetail";
import Header from "../features/common/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route
            path="/clients"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <Client />
              </Suspense>
            }
          />
          <Route path="/cars" element={<Car />} />
          <Route path="/clients/:clientId" element={<ClientDetail />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
