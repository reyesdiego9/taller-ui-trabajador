import { Suspense } from "react";
import Car from "../features/car/Car";
import Client from "../features/client/Client";
import { ClientDetail } from "../features/client/ClientDetail";
import Header from "../features/common/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CarDetailById } from "../features/car/CarDetailById";
import VisitDetail from "../features/visit/VisitDetail";

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
          <Route path="/cars/:id_car" element={<CarDetailById />} />
          <Route path="/clients/:clientId" element={<ClientDetail />} />
          <Route path="/visits/:id_visit" element={<VisitDetail />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
