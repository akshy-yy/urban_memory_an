import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './components/Layout/PublicLayout';
import InteractiveHome from './pages/Public/InteractiveHome';
import Policies from './pages/Public/Policies';
import LiveDataInfo from './pages/Public/LiveDataInfo';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<InteractiveHome />} />
          <Route path="policies" element={<Policies />} />
          <Route path="live-data" element={<LiveDataInfo />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
