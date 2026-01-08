import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './components/Landing';
import Play from './components/Play';
import AiPlayWrapper from './components/AiPlayWrapper';
import About from './pages/About';
import levels from './data/levels.json';

function App() {
  const [difficulty, setDifficulty] = useState(null); // 'easy', 'medium', 'hard'

  const getFilteredLevels = () => {
    // Default to medium if no difficulty selected (for direct link protection) or handle in Play
    const targetDiffVal = difficulty || 'medium';

    const difficultyMap = {
      'easy': 1,
      'medium': 2,
      'hard': [3, 4]
    };

    const targetDiff = difficultyMap[targetDiffVal];
    return levels.filter(lvl => {
      if (Array.isArray(targetDiff)) {
        return targetDiff.includes(lvl.difficulty);
      }
      return lvl.difficulty === targetDiff;
    });
  };

  const activeLevels = getFilteredLevels();

  // Wrapper for Play to handle direct access navigation logic
  const PlayWrapper = () => {
    const navigate = useNavigate();
    // If no difficulty is set, we could redirect to home OR default to medium.
    // Let's default to medium for a smooth "Play Now" experience from Navbar.
    return (
      <Play
        levels={activeLevels}
        onBack={() => navigate('/')} // Use useNavigate for navigation
        difficulty={difficulty || 'medium'}
      />
    );
  };

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomeNavigationWrapper setDifficulty={setDifficulty} />} />
          <Route path="/play" element={<PlayWrapper />} />
          <Route path="/play/ai" element={<AiPlayWrapper />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

// Helper to use navigational hooks outside of the main component which is not inside Router context yet
const HomeNavigationWrapper = ({ setDifficulty }) => {
  const navigate = useNavigate();

  const handlePlay = (diff) => {
    if (diff === 'infinite') {
      navigate('/play/ai');
    } else {
      setDifficulty(diff);
      navigate('/play');
    }
  };

  return <Landing onPlay={handlePlay} />;
};

export default App;
