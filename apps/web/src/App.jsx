import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import ShareStoryPage from './pages/ShareStoryPage';
import SessionsPage from './pages/SessionsPage';
import ContactPage from './pages/ContactPage';
import ResourcesPage from './pages/ResourcesPage';

function App() {
    return (
        <Router>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/share" element={<ShareStoryPage />} />
                <Route path="/sessions" element={<SessionsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/resources" element={<ResourcesPage />} />
            </Routes>
        </Router>
    );
}

export default App;
