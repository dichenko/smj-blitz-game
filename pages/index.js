import { useState } from "react";
import { questionsList } from "../questions";

export default function Home() {
  const [selectedChest, setSelectedChest] = useState(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-100">
      <h1 className="text-4xl font-bold mb-8">Выбери сундук!</h1>
      <div className="grid grid-cols-3 gap-8">
        {questionsList.map((chest) => (
          <button
            key={chest.chest}
            className="bg-yellow-300 hover:bg-yellow-400 rounded-2xl shadow-xl text-2xl px-8 py-12 transition-all border-4 border-yellow-500"
            onClick={() => setSelectedChest(chest)}
          >
            <span className="block text-5xl mb-2">🧰</span>
            №{chest.chest}
          </button>
        ))}
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
      <div className="bg-white rounded-3xl shadow-xl p-12 flex flex-col items-center">
        <div className="text-2xl font-bold mb-6">{questions[qIndex]}</div>
        <div className="text-6xl font-mono text-orange-500 mb-2">{timer > 0 ? timer : "Время!"}</div>
      </div>
    </div>
  );
}
