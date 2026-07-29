import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';
import { AuthProvider } from './context/AuthContext';
import { PipelineProvider } from './context/PipelineContext';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';

import TeamCollaboratorPage from './pages/agents/TeamCollaboratorPage';
import LitReviewPage from './pages/agents/LitReviewPage';
import HackathonMentorPage from './pages/agents/HackathonMentorPage';
import SkillPathPage from './pages/agents/SkillPathPage';
import SprintFlowPage from './pages/agents/SprintFlowPage';
import PlacementPrepPage from './pages/agents/PlacementPrepPage';

import MultiAgentPipelinePage from './pages/MultiAgentPipelinePage';
import SprintHistoryPage from './pages/SprintHistoryPage';
import LearningRoadmapsPage from './pages/LearningRoadmapsPage';
import TeamsProjectsPage from './pages/TeamsProjectsPage';
import HistoryPage from './pages/HistoryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <AuthProvider>
          <PipelineProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Pages */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Dashboard & Workspace Pages */}
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />

                {/* 6 Autonomous AI Agent Studios */}
                <Route path="/agents/collaborator" element={<TeamCollaboratorPage />} />
                <Route path="/agents/lit-review" element={<LitReviewPage />} />
                <Route path="/agents/hackathon-mentor" element={<HackathonMentorPage />} />
                <Route path="/agents/skill-path" element={<SkillPathPage />} />
                <Route path="/agents/sprint-flow" element={<SprintFlowPage />} />
                <Route path="/agents/placement-prep" element={<PlacementPrepPage />} />

                {/* Chained Pipeline & Ecosystem Pages */}
                <Route path="/pipeline" element={<MultiAgentPipelinePage />} />
                <Route path="/sprint-history" element={<SprintHistoryPage />} />
                <Route path="/learning-roadmaps" element={<LearningRoadmapsPage />} />
                <Route path="/teams-projects" element={<TeamsProjectsPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/settings" element={<SettingsPage />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </PipelineProvider>
        </AuthProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
