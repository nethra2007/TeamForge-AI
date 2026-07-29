import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { updateProfileApi } from '../services/profileApi';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import { User, GraduationCap, Briefcase, Code, Save, FileText } from 'lucide-react';

export default function ProfilePage() {
  const { userProfile, setUserProfile } = useUser();
  const [formData, setFormData] = useState({
    name: userProfile.name || '',
    college: userProfile.college || '',
    branch: userProfile.branch || '',
    year: userProfile.year || '',
    bio: userProfile.bio || '',
    skillsStr: Array.isArray(userProfile.skills)
      ? userProfile.skills.join(', ')
      : (userProfile.skills || ''),
    interestsStr: Array.isArray(userProfile.interests)
      ? userProfile.interests.join(', ')
      : (userProfile.interests || ''),
    preferredRole: userProfile.preferredRole || '',
    targetCareer: userProfile.targetCareer || '',
    targetCompany: userProfile.targetCompany || '',
    githubUrl: userProfile.githubUrl || '',
    linkedinUrl: userProfile.linkedinUrl || '',
    resumeText: userProfile.resumeText || ''
  });

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setToast({ type: '', message: '' });

    const payload = {
      ...formData,
      skills: formData.skillsStr.split(',').map(s => s.trim()).filter(Boolean),
      interests: formData.interestsStr.split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      await updateProfileApi(payload);
      setUserProfile(payload);
      setToast({ type: 'success', message: 'Student profile updated and synced with AI Agents!' });
    } catch (err) {
      setUserProfile(payload);
      setToast({ type: 'success', message: 'Profile saved to local agent workspace context!' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0B0F17] text-gray-900 dark:text-white transition-colors">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <User className="w-6 h-6 text-brand-500" />
              <span>Student Profile Setup</span>
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Your profile context is automatically fed into all 6 autonomous AI agents during execution.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="saas-card p-6 space-y-6">
            
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-brand-500 uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="w-4 h-4" /> Academic & Personal Details
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="saas-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    College / Institute
                  </label>
                  <input
                    type="text"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    placeholder="Enter your college name"
                    className="saas-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Branch / Major
                  </label>
                  <input
                    type="text"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    placeholder="Example: Computer Science, ECE"
                    className="saas-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Academic Year
                  </label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="Example: First Year, Third Year"
                    className="saas-input"
                  />
                </div>
              </div>
            </div>

            {/* Skills & Targets */}
            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-sm text-brand-500 uppercase tracking-wider flex items-center gap-2">
                <Code className="w-4 h-4" /> Technical Skills & Career Aspirations
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Current Skills (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={formData.skillsStr}
                    onChange={(e) => setFormData({ ...formData, skillsStr: e.target.value })}
                    placeholder="Example: React.js, Python, SQL"
                    className="saas-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Preferred Team Role
                  </label>
                  <input
                    type="text"
                    value={formData.preferredRole}
                    onChange={(e) => setFormData({ ...formData, preferredRole: e.target.value })}
                    placeholder="Example: Full Stack Developer, AI Engineer"
                    className="saas-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Target Career Goal
                  </label>
                  <input
                    type="text"
                    value={formData.targetCareer}
                    onChange={(e) => setFormData({ ...formData, targetCareer: e.target.value })}
                    placeholder="Example: Full Stack Developer, Data Scientist"
                    className="saas-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Target Companies
                  </label>
                  <input
                    type="text"
                    value={formData.targetCompany}
                    onChange={(e) => setFormData({ ...formData, targetCompany: e.target.value })}
                    placeholder="Example: Google, Microsoft, Amazon"
                    className="saas-input"
                  />
                </div>
              </div>
            </div>

            {/* Resume Text */}
            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-sm text-brand-500 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4" /> Resume Content (For PlacementPrep AI)
              </h3>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Paste Resume Plaintext / Summary
                </label>
                <textarea
                  rows={4}
                  value={formData.resumeText}
                  onChange={(e) => setFormData({ ...formData, resumeText: e.target.value })}
                  placeholder="Paste your resume text here so PlacementPrep AI can evaluate strengths, weaknesses, and generate targeted interview questions..."
                  className="saas-input font-mono text-xs"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button type="submit" disabled={saving} className="saas-btn-primary py-2.5 px-6">
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Profile Context'}</span>
              </button>
            </div>

          </form>

        </main>
      </div>

      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ type: '', message: '' })} />
      <Footer />
    </div>
  );
}
