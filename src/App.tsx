import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import People from './pages/People';
import Orders from './pages/Orders';
import Taxes from './pages/Taxes';
import Summary from './pages/Summary';
import HistoryDetail from './pages/HistoryDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/split/people" element={<People />} />
        <Route path="/split/orders" element={<Orders />} />
        <Route path="/split/taxes" element={<Taxes />} />
        <Route path="/split/summary" element={<Summary />} />
        <Route path="/history/:id" element={<HistoryDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
