import { useState } from "react";
import { questionsList } from "../questions";
import Image from 'next/image';

export default function Home() {
  const [selectedChest, setSelectedChest] = useState(null);
  const [openedChests, setOpenedChests] = useState([]);

  const handleChestClick = (chest) => {
    if (!openedChests.includes(chest.chest)) {
      setSelectedChest(chest);
      setOpenedChests([...openedChests, chest.chest]);
    }
  };

  const resetGame = () => {
    setOpenedChests([]);
    setSelectedChest(null);
  };

  // Разбиваем сундуки на три ряда: 4-3-4
  const firstRow = [1, 2, 3, 4];
  const middleRow = [5, 6, 7];
  const lastRow = [8, 9, 10, 11];

  const renderChest = (chestNumber) => {
    const chest = questionsList.find(q => q.chest === chestNumber) || {
      chest: chestNumber,
      questions: ["Вопрос будет добавлен позже"]
    };
    const isOpened = openedChests.includes(chestNumber);
    
    return (
      <div key={chestNumber} className="relative">
        <button
          className={`w-full bg-transparent transition-all duration-300 transform ${
            isOpened 
              ? 'opacity-50 cursor-not-allowed filter grayscale' 
              : 'hover:scale-105'
          }`}
          onClick={() => handleChestClick(chest)}
          disabled={isOpened}
        >
          <Image
            src={`/images/Sunduk_${chestNumber.toString().padStart(2, '0')}.png`}
            alt={`Сундук ${chestNumber}`}
            width={230}
            height={230}
            className="rounded-2xl"
          />
        </button>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 px-6 py-2 rounded-lg min-w-[60px] text-center">
          <span className="text-white text-2xl">
            №{chestNumber}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative">
      {/* Фоновое изображение */}
      <Image
        src="/images/Фон-9.png"
        alt="Background"
        fill
        className="object-none object-right-top z-0"
        priority
      />

      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-6xl mb-16">Выбери сундук!</h1>
        <div className="flex flex-col gap-12 max-w-7xl mx-auto px-4">
          {/* Первый ряд */}
          <div className="grid grid-cols-4 gap-12">
            {firstRow.map(renderChest)}
          </div>
          {/* Средний ряд */}
          <div className="grid grid-cols-3 gap-12 mx-auto">
            {middleRow.map(renderChest)}
          </div>
          {/* Последний ряд */}
          <div className="grid grid-cols-4 gap-12">
            {lastRow.map(renderChest)}
          </div>
        </div>
      </div>

      {/* Кнопка сброса */}
      <button
        onClick={resetGame}
        className="fixed bottom-8 right-8 z-20 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-colors"
        title="Начать игру заново"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
          />
        </svg>
      </button>

      {selectedChest && (
        <Game 
          questions={selectedChest.questions} 
          onReset={() => setSelectedChest(null)} 
        />
      )}
    </div>
  );
}

// Таймер и звуки
import { useEffect, useRef } from "react";

function Game({ questions, onReset }) {
  const [qIndex, setQIndex] = useState(0);
  const [timer, setTimer] = useState(5);
  const tickingRef = useRef();
  const bellRef = useRef();

  useEffect(() => {
    tickingRef.current?.play();
    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [qIndex]);

  useEffect(() => {
    if (timer === 0) {
      tickingRef.current?.pause();
      tickingRef.current.currentTime = 0;
      bellRef.current?.play();
      setTimeout(() => {
        if (qIndex < questions.length - 1) {
          setQIndex((i) => i + 1);
          setTimer(10);
        } else {
          onReset();
        }
      }, 1000);
    }
  }, [timer, qIndex, questions.length, onReset]);

  if (qIndex === questions.length) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50">
      <audio src="/ticking.mp3" ref={tickingRef} loop />
      <audio src="/bell.mp3" ref={bellRef} />
      <div className="bg-white rounded-3xl shadow-xl p-12 flex flex-col items-center relative">
        <button 
          onClick={onReset}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="text-2xl font-bold mb-6">{questions[qIndex]}</div>
        <div className="text-6xl font-mono text-orange-500 mb-2">{timer > 0 ? timer : "Время!"}</div>
      </div>
    </div>
  );
}

// Добавляем стили для тени текста
const styles = `
  .text-shadow {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
  .text-shadow-strong {
    text-shadow: 
      2px 2px 0 #000,
      -2px -2px 0 #000,
      2px -2px 0 #000,
      -2px 2px 0 #000,
      0 2px 0 #000,
      2px 0 0 #000,
      0 -2px 0 #000,
      -2px 0 0 #000;
  }
`;

// Добавляем стили в head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
