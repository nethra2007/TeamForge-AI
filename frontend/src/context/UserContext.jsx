import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(() => {
    // Only restore profile from localStorage if it was explicitly saved by the user
    // Never populate hardcoded demo defaults
    const saved = localStorage.getItem('teamforge_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        localStorage.removeItem('teamforge_user_profile');
      }
    }
    return {
      name: '',
      email: '',
      college: '',
      branch: '',
      year: '',
      skills: [],
      interests: [],
      preferredRole: '',
      targetCareer: '',
      targetCompany: '',
      readinessScore: 0,
      resumeText: ''
    };
  });

  const updateProfileState = (updatedData) => {
    setUserProfile(prev => {
      const next = { ...prev, ...updatedData };
      localStorage.setItem('teamforge_user_profile', JSON.stringify(next));
      return next;
    });
  };

  return (
    <UserContext.Provider value={{ userProfile, setUserProfile: updateProfileState }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
