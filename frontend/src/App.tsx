import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { DocumentDetailPage } from './components/documents/DocumentDetailPage'
import { DocumentsPage } from './components/documents/DocumentsPage'

function App() {

  return (
    <Layout>
      <Routes>
        <Route path='/' element={<Navigate to="/documents" replace />} />
        <Route path='/documents' element={<DocumentsPage />} />
        <Route path='/documents/:documentId' element={<DocumentDetailPage />} />
        <Route />
      </Routes>
    </Layout>
  )
}

export default App
