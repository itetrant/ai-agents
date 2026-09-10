import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import GettingStarted from './pages/GettingStarted';
import WebGuide from './pages/WebGuide';
import AppGuide from './pages/AppGuide';
import ApiStandard from './pages/ApiStandard';
import Conventions from './pages/Conventions';

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bat-dau" element={<GettingStarted />} />
          <Route path="/huong-dan-web" element={<WebGuide />} />
          <Route path="/huong-dan-app" element={<AppGuide />} />
          <Route path="/api-standard" element={<ApiStandard />} />
          <Route path="/quy-uoc" element={<Conventions />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
