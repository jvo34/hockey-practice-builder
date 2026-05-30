import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { PracticePlannerProvider } from './context/PracticePlannerContext';
import { DashboardPage } from './pages/DashboardPage';
import { DrillDetailPage } from './pages/DrillDetailPage';
import { DrillLibraryPage } from './pages/DrillLibraryPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PlanCreatePage } from './pages/PlanCreatePage';
import { PlanEditorPage } from './pages/PlanEditorPage';
import { PrintPlanPage } from './pages/PrintPlanPage';
import { SmartGeneratorPage } from './pages/SmartGeneratorPage';

function App() {
  return (
    <PracticePlannerProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="/plans/new" element={<PlanCreatePage />} />
            <Route path="/plans/:planId/edit" element={<PlanEditorPage />} />
            <Route path="/library" element={<DrillLibraryPage />} />
            <Route path="/library/:drillId" element={<DrillDetailPage />} />
            <Route path="/smart-generator" element={<SmartGeneratorPage />} />
            <Route path="/plans/:planId/print" element={<PrintPlanPage />} />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PracticePlannerProvider>
  );
}

export default App;
