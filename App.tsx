
import React, { useState, useEffect } from 'react';
import { generateYouTubeContent } from './services/geminiService';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import { YouTubeContent } from './types';
import { GEMINI_API_KEY_AVAILABLE } from './constants';

const App: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [generatedContent, setGeneratedContent] = useState<YouTubeContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyMissingError, setApiKeyMissingError] = useState<string | null>(null);

  useEffect(() => {
    if (!GEMINI_API_KEY_AVAILABLE) {
      setApiKeyMissingError("Gemini API Key is not configured. Please ensure the API_KEY environment variable is set. Content generation is disabled.");
    }
  }, []);

  const handleGenerateContent = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic for your YouTube video.");
      return;
    }
    if (!GEMINI_API_KEY_AVAILABLE) {
      setError("Cannot generate content: Gemini API Key is not configured.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);

    try {
      const content = await generateYouTubeContent(topic);
      setGeneratedContent(content);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred while generating content.");
      }
      setGeneratedContent(null); // Clear any partial content on error
    } finally {
      setIsLoading(false);
    }
  };

  const renderContentSection = (title: string, content: string | string[], preformatted: boolean = false, listType: 'ul' | 'pills' = 'ul') => {
    if (!content || (Array.isArray(content) && content.length === 0)) return null;

    return (
      <div className="bg-neutral-medium/30 backdrop-blur-sm p-6 rounded-lg shadow-lg mb-6 animate-fade-in-up">
        <h3 className="text-2xl font-semibold text-brand-primary mb-3">{title}</h3>
        {preformatted && typeof content === 'string' ? (
          <pre className="text-neutral-light whitespace-pre-wrap font-sans text-sm leading-relaxed">{content}</pre>
        ) : Array.isArray(content) ? (
          listType === 'ul' ? (
            <ul className="list-disc list-inside text-neutral-light space-y-1 text-sm">
              {content.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : ( // pills for tags
            <div className="flex flex-wrap gap-2">
              {content.map((item, index) => (
                <span key={index} className="bg-brand-secondary/80 text-neutral-light text-xs font-medium px-2.5 py-1 rounded-full shadow">
                  {item}
                </span>
              ))}
            </div>
          )
        ) : (
          <p className="text-neutral-light text-sm leading-relaxed">{content}</p>
        )}
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-neutral-dark flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-8 sm:mb-10 animate-fade-in-up">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary mb-3">
          AI YouTube Content Generator
        </h1>
        <p className="text-lg text-neutral-light max-w-2xl mx-auto">
          Describe your video topic below, and let AI help you craft compelling titles, script outlines, descriptions, and tags for your YouTube channel!
        </p>
      </header>

      {apiKeyMissingError && (
        <div className="w-full max-w-2xl mb-6 animate-fade-in-up">
            <ErrorDisplay message={apiKeyMissingError} />
        </div>
      )}

      <main className="w-full max-w-2xl mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="bg-neutral-medium/30 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-neutral-medium">
          <label htmlFor="topicInput" className="block text-xl font-semibold text-neutral-light mb-3">
            Enter Your Video Topic:
          </label>
          <textarea
            id="topicInput"
            rows={3}
            className="w-full p-3 bg-neutral-dark/50 border border-neutral-medium rounded-lg text-neutral-light focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-colors placeholder-neutral-light/50"
            placeholder="e.g., 'Beginner's guide to React Hooks', 'Easy vegan recipes for students'"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={!GEMINI_API_KEY_AVAILABLE || isLoading}
            aria-label="Video topic input"
          />
          <button
            onClick={handleGenerateContent}
            disabled={isLoading || !GEMINI_API_KEY_AVAILABLE || !topic.trim()}
            className="mt-4 w-full bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            aria-live="polite"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              'Generate Content'
            )}
          </button>
        </div>
      </main>
      
      {isLoading && <LoadingSpinner message="Crafting your YouTube masterpiece..." />}
      
      {error && !isLoading && (
         <div className="w-full max-w-2xl animate-fade-in-up">
            <ErrorDisplay message={error} />
         </div>
      )}

      {!isLoading && generatedContent && (
        <section className="w-full max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {renderContentSection("Suggested Titles", generatedContent.titles)}
          {renderContentSection("Script Outline", generatedContent.scriptOutline, true)}
          {renderContentSection("Video Description", generatedContent.description, true)}
          {renderContentSection("Tags", generatedContent.tags, false, 'pills')}
        </section>
      )}

      <footer className="mt-12 text-center text-neutral-medium text-sm animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <p>&copy; {new Date().getFullYear()} AI YouTube Content Generator. All rights reserved.</p>
        <p>Powered by React, Tailwind CSS, and the Gemini API.</p>
      </footer>
    </div>
  );
};

export default App;