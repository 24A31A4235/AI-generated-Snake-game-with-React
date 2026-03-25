import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

interface Point {
  x: number;
  y: number;
}

export default function SnakeGame({ onScoreUpdate }: { onScoreUpdate: (score: number) => void }) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const directionRef = useRef(direction);
  directionRef.current = direction;

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
    onScoreUpdate(0);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        setIsPaused((p) => !p);
        return;
      }

      if (gameOver) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (currentDir.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          if (currentDir.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          if (currentDir.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          if (currentDir.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => {
            const newScore = s + 10;
            onScoreUpdate(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, 150);
    return () => clearInterval(intervalId);
  }, [food, gameOver, isPaused, generateFood, onScoreUpdate]);

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-md mx-auto aspect-square bg-gray-900/50 rounded-xl border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.3)] overflow-hidden backdrop-blur-sm">
      <div
        className="grid w-full h-full p-2 gap-[1px]"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(index / GRID_SIZE);
          const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={index}
              className={`w-full h-full rounded-sm transition-all duration-75 ${
                isHead
                  ? 'bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.8)] z-10'
                  : isSnake
                  ? 'bg-cyan-500 shadow-[0_0_5px_rgba(6,182,212,0.5)]'
                  : isFood
                  ? 'bg-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.8)] animate-pulse'
                  : 'bg-gray-800/30'
              }`}
            />
          );
        })}
      </div>

      {/* Overlays */}
      {(gameOver || isPaused) && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
          {gameOver ? (
            <>
              <h2 className="text-4xl font-black text-fuchsia-500 mb-2 tracking-widest drop-shadow-[0_0_10px_rgba(217,70,239,0.8)]">
                GAME OVER
              </h2>
              <p className="text-cyan-300 text-xl mb-6 font-mono">Score: {score}</p>
              <button
                onClick={resetGame}
                className="px-6 py-2 bg-transparent border-2 border-cyan-400 text-cyan-400 font-bold rounded hover:bg-cyan-400 hover:text-black transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_25px_rgba(34,211,238,0.8)] uppercase tracking-wider"
              >
                Play Again
              </button>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-black text-cyan-400 mb-6 tracking-widest drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                PAUSED
              </h2>
              <button
                onClick={() => setIsPaused(false)}
                className="px-6 py-2 bg-transparent border-2 border-fuchsia-500 text-fuchsia-500 font-bold rounded hover:bg-fuchsia-500 hover:text-black transition-all shadow-[0_0_15px_rgba(217,70,239,0.4)] hover:shadow-[0_0_25px_rgba(217,70,239,0.8)] uppercase tracking-wider"
              >
                Resume
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
