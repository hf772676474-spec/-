import { Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './state/AppContext'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import GroupsPage from './pages/GroupsPage'
import SurveyPage from './pages/SurveyPage'
import ResultsPage from './pages/ResultsPage'
import EvidencePage from './pages/EvidencePage'

export default function App() {
  return (
    <AppProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/survey" element={<SurveyPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/evidence" element={<EvidencePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </AppProvider>
  )
}

