import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NewFormPage from './pages/NewFormPage';
import FillFormPage from './pages/FillFormPage';
import ResponsesPage from './pages/ResponsesPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/forms/new" element={<NewFormPage />} />
      <Route path="/forms/:id/fill" element={<FillFormPage />} />
      <Route path="/forms/:id/responses" element={<ResponsesPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}