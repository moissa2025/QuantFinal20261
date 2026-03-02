import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AppShell from "./components/layout/AppShell.jsx";
import Home from "./pages/Home.jsx";
import ApiDocs from "./pages/ApiDocs.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Legal from "./pages/Legal.jsx";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";
import Support from "./pages/Support.jsx";
import Status from "./pages/Status.jsx";
import TradingTerminal from "./pages/TradingTerminal.jsx";
import MarketData from "./pages/MarketData.jsx";
import Positions from "./pages/Positions.jsx";
import Ledger from "./pages/Ledger.jsx";
import Risk from "./pages/Risk.jsx";
import Strategies from "./pages/Strategies.jsx";
import InstitutionOnboarding from "./pages/InstitutionOnboarding.jsx";
const App = () => {
  return (
    <Router>
      <Routes>
        {/* PUBLIC LANDING */}
        <Route path="/" element={<Landing />} />

        {/* AUTH PAGES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* AUTHENTICATED AREA (WRAPPED IN APPSHELL) */}
        <Route
          path="/dashboard"
          element={
            <AppShell>
              <Dashboard />
            </AppShell>
          }
        />
        <Route
          path="/home"
          element={
            <AppShell>
              <Home />
            </AppShell>
          }
        />
        <Route
          path="/trading"
          element={
            <AppShell>
              <TradingTerminal />
            </AppShell>
          }
        />
        <Route
          path="/market-data"
          element={
            <AppShell>
              <MarketData />
            </AppShell>
          }
        />
        <Route
          path="/positions"
          element={
            <AppShell>
              <Positions />
            </AppShell>
          }
        />
        <Route
          path="/ledger"
          element={
            <AppShell>
              <Ledger />
            </AppShell>
          }
        />
        <Route
          path="/risk"
          element={
            <AppShell>
              <Risk />
            </AppShell>
          }
        />
        <Route
          path="/strategies"
          element={
            <AppShell>
              <Strategies />
            </AppShell>
          }
        />
        <Route
          path="/about"
          element={
            <AppShell>
              <About />
            </AppShell>
          }
        />
        <Route
          path="/contact"
          element={
            <AppShell>
              <Contact />
            </AppShell>
          }
        />
        <Route
          path="/legal"
          element={
            <AppShell>
              <Legal />
            </AppShell>
          }
        />
        <Route
          path="/privacy"
          element={
            <AppShell>
              <Privacy />
            </AppShell>
          }
        />
        <Route
          path="/terms"
          element={
            <AppShell>
              <Terms />
            </AppShell>
          }
        />
        <Route
          path="/support"
          element={
            <AppShell>
              <Support />
            </AppShell>
          }
        />
        <Route
          path="/status"
          element={
            <AppShell>
              <Status />
            </AppShell>
          }
        />
        <Route
          path="/api-docs"
          element={
            <AppShell>
              <ApiDocs />
            </AppShell>
          }
        />
        <Route 
          path="/institution/onboarding" 
  	  element={ 
              <AppShell> 
 		<InstitutionOnboarding /> 
	      </AppShell> 
             }
           />
      </Routes>
    </Router>
  );
};

export default App;

