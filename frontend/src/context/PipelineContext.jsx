import React, { createContext, useContext, useState } from 'react';

const PipelineContext = createContext();

export const PipelineProvider = ({ children }) => {
  const [pipelineState, setPipelineState] = useState(() => {
    const saved = localStorage.getItem('teamforge_pipeline_state');
    return saved ? JSON.parse(saved) : {
      collaboratorOutput: null,
      litReviewOutput: null,
      hackathonMentorOutput: null,
      skillPathOutput: null,
      sprintFlowOutput: null,
      placementPrepOutput: null,
      lastUpdated: null,
      activeAgentIndex: 0
    };
  });

  const setAgentOutput = (agentKey, outputData) => {
    setPipelineState(prev => {
      const next = {
        ...prev,
        [agentKey]: outputData,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('teamforge_pipeline_state', JSON.stringify(next));
      return next;
    });
  };

  const clearPipeline = () => {
    const fresh = {
      collaboratorOutput: null,
      litReviewOutput: null,
      hackathonMentorOutput: null,
      skillPathOutput: null,
      sprintFlowOutput: null,
      placementPrepOutput: null,
      lastUpdated: null,
      activeAgentIndex: 0
    };
    localStorage.setItem('teamforge_pipeline_state', JSON.stringify(fresh));
    setPipelineState(fresh);
  };

  return (
    <PipelineContext.Provider value={{ pipelineState, setAgentOutput, clearPipeline }}>
      {children}
    </PipelineContext.Provider>
  );
};

export const usePipeline = () => useContext(PipelineContext);
