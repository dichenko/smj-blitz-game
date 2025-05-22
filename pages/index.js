import { useState } from "react";
import { questionsList } from "../questions";
import Image from 'next/image';

export default function Home() {
  const [selectedChest, setSelectedChest] = useState(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative">
      {/* Фоновое изображение */}
      <Image
        src="/images/Фон-9.png"
        alt="Background"
        fill
        className="object-cover z-0"
        priority
      />

      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-5xl font-bold mb-8 text-gray-800">
          Выбери сундук!
        </h1>
        <div className="grid grid-cols-4 gap-8 max-w-6xl mx-auto px-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((chestNumber) => {
            const chest = questionsList.find(q => q.chest === chestNumber) || {
              chest: chestNumber,
              questions: ["Вопрос будет добавлен позже"]
            };
            
            return (
              <div key={chestNumber} className="relative">
                <button
                  className="w-full bg-transparent hover:scale-105 transition-all duration-300 transform"
                  onClick={() => setSelectedChest(chest)}
                >
                  <Image
                    src={`/images/Sunduk_0${chestNumber}.png`}
                    alt={`Сундук ${chestNumber}`}
                    width={200}
                    height={200}
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
          })}
        </div>
      </div>

      {selectedChest && (
        <Game questions={selectedChest.questions} onReset={() => setSelectedChest(null)} />
      )}
    </div>
  );
}

// Таймер и звуки
import { useEffect, useRef } from "react";

function Game({ questions, onReset }) {
  const [qIndex, setQIndex] = useState(0);
  const [timer, setTimer] = useState(10);
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
        }
      }, 1000);
    }
  }, [timer, qIndex, questions.length]);

  if (qIndex === questions.length) {
    return (
      <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
        <h2 className="text-4xl text-white font-bold mb-4">Финал!</h2>
        <button className="bg-orange-400 text-white px-6 py-4 rounded-xl mt-4 text-xl" onClick={onReset}>
          Начать заново
        </button>
      </div>
    );
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
