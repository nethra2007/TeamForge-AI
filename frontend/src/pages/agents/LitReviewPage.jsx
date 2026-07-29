import React, { useState } from 'react';
import { usePipeline } from '../../context/PipelineContext';
import { runLitReviewApi } from '../../services/agentApi';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import Toast from '../../components/Toast';
import { BookOpen, Sparkles, ExternalLink, FileText, AlertTriangle, Lightbulb, Compass, Award, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LitReviewPage() {
  const { setAgentOutput } = usePipeline();

  // Requirements: Empty initial states without hardcoded preloaded topics
  const [topic, setTopic] = useState('');
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState({ type: '', message: '' });

  const handleRunAgent = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setToast({ type: 'error', message: 'Please enter a research topic.' });
      return;
    }

    setLoading(true);
    setToast({ type: '', message: '' });

    try {
      const res = await runLitReviewApi({ topic: topic.trim(), domain: domain.trim() });
      setResult(res);
      setAgentOutput('litReviewOutput', res.output);

      if (res.output?.noPapersFound || !res.output?.papers || res.output.papers.length === 0) {
        setToast({ type: 'warning', message: 'No relevant research papers were found for this topic.' });
      } else {
        setToast({ type: 'success', message: `Retrieved ${res.output.papers.length} papers & synthesized literature review!` });
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Literature review generation failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0B0F17] text-gray-900 dark:text-white transition-colors">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/10 text-purple-500 border border-purple-500/20">
                  Agent 02
                </span>
                <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
                  LitReview AI
                </h1>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Searches real research papers via Semantic Scholar API (with arXiv fallback) and synthesizes literature reviews via Gemini API.
              </p>
            </div>

            <Link to="/agents/hackathon-mentor" className="saas-btn-secondary text-xs hidden sm:inline-flex">
              <span>Hackathon Mentor &rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* User Input Form */}
            <form onSubmit={handleRunAgent} className="saas-card p-5 space-y-4 lg:col-span-1 h-fit">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-500" />
                <span>Search Parameters</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  Research Topic <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Autonomous Multi-Agent AI Systems"
                  className="saas-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  Academic Domain
                </label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="e.g. Artificial Intelligence & Computer Science"
                  className="saas-input text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="saas-btn-primary w-full py-2.5 text-xs bg-purple-600 hover:bg-purple-500 shadow-purple-500/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? 'Searching Semantic Scholar / arXiv...' : 'Search & Synthesize Review'}</span>
              </button>
            </form>

            {/* Output Studio */}
            <div className="lg:col-span-2 space-y-4">
              {result ? (
                <div className="space-y-4 animate-fadeIn">
                  
                  {/* Standard Metadata Header */}
                  <div className="saas-card p-3 bg-gray-100/50 dark:bg-gray-800/40 text-[11px] font-mono flex items-center justify-between text-gray-500 dark:text-gray-400">
                    <span>Engine: {result.metadata?.provider || 'Semantic Scholar + Gemini API'}</span>
                    <span>Latency: {result.executionTime}</span>
                    <span>Retrieved Papers: {result.output.papers?.length || 0}</span>
                  </div>

                  {/* Warning if no papers found */}
                  {(result.output.noPapersFound || !result.output.papers || result.output.papers.length === 0) && (
                    <div className="saas-card p-6 border-l-4 border-l-amber-500 bg-amber-500/10 text-amber-500 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <AlertTriangle className="w-5 h-5" />
                        <span>No relevant research papers were found for this topic.</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        Try refining or broadening your search query terms (e.g., use standard academic keywords like "Machine Learning", "Graph Neural Networks", or "Distributed Systems").
                      </p>
                    </div>
                  )}

                  {/* Section 1: Top Research Papers */}
                  {result.output.papers && result.output.papers.length > 0 && (
                    <div className="saas-card p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                          <FileText className="w-4 h-4 text-purple-500" />
                          <span>Top Research Papers (Semantic Scholar & arXiv)</span>
                        </h4>
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400">
                          {result.output.papers.length} Papers Retrieved
                        </span>
                      </div>

                      <div className="space-y-3.5">
                        {result.output.papers.map((paper, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/80 space-y-2.5"
                          >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                              <h5 className="font-bold text-xs text-gray-900 dark:text-white leading-snug">
                                {paper.title}
                              </h5>
                              
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                  {paper.year}
                                </span>
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                  {paper.citationCount !== undefined ? `${paper.citationCount} Citations` : 'arXiv'}
                                </span>
                              </div>
                            </div>

                            <p className="text-[11px] font-medium text-purple-400">
                              Authors: {Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors}
                            </p>

                            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                              {paper.abstract}
                            </p>

                            <div className="pt-2 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-xs">
                              <span className="text-[10px] text-gray-400 font-mono">
                                Source: {paper.source || 'Semantic Scholar API'}
                              </span>
                              {paper.url && (
                                <a
                                  href={paper.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="saas-btn-secondary py-1 px-3 text-[11px] inline-flex items-center gap-1.5"
                                >
                                  <span>View Paper</span>
                                  <ExternalLink className="w-3 h-3 text-purple-400" />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Section 2: AI Generated Literature Review */}
                  {result.output.literatureReview && (
                    <div className="saas-card p-5 space-y-3 border-l-4 border-l-purple-500">
                      <span className="text-[10px] font-bold text-purple-500 uppercase tracking-wider">
                        AI Generated Literature Review
                      </span>
                      <p className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed">
                        {result.output.literatureReview}
                      </p>
                    </div>
                  )}

                  {/* Section 3: Key Findings & Comparison of Existing Methods */}
                  {result.output.keyFindings && result.output.keyFindings.length > 0 && (
                    <div className="saas-card p-5 space-y-3">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                        <Award className="w-4 h-4 text-brand-500" />
                        <span>Key Findings & Comparison of Existing Methods</span>
                      </h4>
                      <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
                        {result.output.keyFindings.map((kf, i) => (
                          <li key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                            <span>{kf}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Section 4: Research Gap Analysis & Future Scope */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {result.output.researchGap && (
                      <div className="saas-card p-5 space-y-2 border-l-4 border-l-amber-500">
                        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5" /> Research Gap Analysis
                        </span>
                        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                          {result.output.researchGap}
                        </p>
                      </div>
                    )}

                    {result.output.futureScope && (
                      <div className="saas-card p-5 space-y-2 border-l-4 border-l-emerald-500">
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1.5">
                          <Compass className="w-3.5 h-3.5" /> Future Scope
                        </span>
                        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                          {result.output.futureScope}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Section 5: Conclusion */}
                  {result.output.conclusion && (
                    <div className="saas-card p-5 space-y-2 bg-gradient-to-r from-purple-900/10 to-indigo-900/10 border-purple-500/30">
                      <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                        Concluding Summary
                      </span>
                      <p className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed">
                        {result.output.conclusion}
                      </p>
                    </div>
                  )}

                </div>
              ) : (
                <div className="saas-card p-12 text-center text-gray-400 space-y-3">
                  <BookOpen className="w-10 h-10 mx-auto text-purple-500/50" />
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    LitReview AI Studio Ready
                  </p>
                  <p className="text-xs max-w-sm mx-auto text-gray-400">
                    Enter your Research Topic on the left to query Semantic Scholar & arXiv APIs and synthesize literature reviews via Gemini API.
                  </p>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>

      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ type: '', message: '' })} />
      <Footer />
    </div>
  );
}
