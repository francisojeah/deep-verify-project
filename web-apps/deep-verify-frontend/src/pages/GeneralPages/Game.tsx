import React, { useState, useEffect } from "react";
import MetaTags from "../../components/MetaTags";
import PageLayout from "../../components/PageLayout";

interface ImageData {
  id: string;
  url: string;
  isDeepfake: boolean;
}

const images: ImageData[] = Array.from({ length: 10 }, (_, i) => ({
  id: String(i + 1),
  url: `/assets/images/${i < 5 ? 'real' : 'fake'}${(i % 5) + 1}.jpg`,
  isDeepfake: i >= 5
}));

const GamePage: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [shuffledImages, setShuffledImages] = useState<ImageData[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    setShuffledImages([...images].sort(() => Math.random() - 0.5));
  }, []);

  const handleGuess = (isDeepfake: boolean) => {
    const correct = shuffledImages[currentImageIndex].isDeepfake === isDeepfake;
    setScore(prevScore => prevScore + (correct ? 1 : 0));
    setFeedback(correct ? "Correct!" : "Wrong!");

    setTimeout(() => {
      setFeedback(null);
      if (currentImageIndex < 9) {
        setCurrentImageIndex(prevIndex => prevIndex + 1);
      } else {
        setGameOver(true);
      }
    }, 1000);
  };

  const resetGame = () => {
    setCurrentImageIndex(0);
    setScore(0);
    setGameOver(false);
    setShuffledImages([...images].sort(() => Math.random() - 0.5));
  };

  return (
    <PageLayout>
      <MetaTags title="Deepfake Detection Game" />
      <div className="-mt-14 max-w-4xl mx-auto flex items-center flex-col">
        <h1 className="text-4xl font-bold text-center text-indigo-600 mb-8">
          Deepfake Detection Game
        </h1>
        {gameOver ? (
          <div className="text-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <p className="text-2xl text-gray-800 dark:text-white mb-4">
              Game Over! Your score is {score} out of 10.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              {score < 5 ? "Keep practicing!" : score < 8 ? "Good job!" : "Excellent work!"}
            </p>
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Play Again
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="relative mb-6">
              <img
                src={shuffledImages[currentImageIndex]?.url}
                alt="Deepfake or Real"
                className="w-auto rounded-lg shadow-lg"
                style={{ height: "calc(100vh/2)" }}
              />
              {feedback && (
                <div className={`absolute top-4 right-4 px-4 py-2 rounded-full text-white font-bold ${
                  feedback === "Correct!" ? "bg-green-500" : "bg-red-500"
                }`}>
                  {feedback}
                </div>
              )}
            </div>
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => handleGuess(false)}
                className="px-6 py-3 w-36 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
              >
                Real
              </button>
              <button
                onClick={() => handleGuess(true)}
                className="px-6 py-3 w-36 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
              >
                Deepfake
              </button>
            </div>
            <div className="border border-neutral-300 dark:border-neutral-500 rounded-xl shadow p-4">
              <p className="text-xl text-gray-800 dark:text-white">
                Score: {score} / {currentImageIndex + 1}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700 mt-2">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{width: `${(score / 10) * 100}%`}}></div>
              </div>
            </div>
          </div>
        )}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Images are sourced from various datasets for educational purposes only.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default GamePage;