import * as React from "react";
import {useEffect, useState} from "react";

import logo from "../assets/logo.png";

import styles from "./App.module.scss";

import "./app.css";

import he from "he";

const App: React.FC = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [count, setCount] = useState(10);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("https://opentdb.com/api.php?amount=10");
      const data = await response.json();

      setQuestions(data.results);
    } catch (error) {
      console.log("Error fetching questions:", error);
    }
  };

  // Maneja la selección de una respuesta
  const handleAnswerSelect = (answer) => {
    if (!selectedAnswer) {
      setSelectedAnswer(answer);

      const question = questions[currentQuestion];

      setCorrectAnswer(question.correct_answer);

      // Comprueba si la respuesta es correcta y actualiza el puntaje
      if (answer === question.correct_answer) {
        if (question.type === "boolean") {
          setScore(score + 5);
        } else {
          setScore(score + 10);
        }
      }
    }
  };

  // Maneja el avance a la siguiente pregunta
  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setCorrectAnswer(null);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  // Reinicia el juego
  const restartGame = () => {
    setScore(0);
    setCurrentQuestion(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setCorrectAnswer(null);
    fetchQuestions();
  };

  // Muestra la pantalla de resultado
  const renderResult = () => {
    return (
      <div>
        <h2>¡Juego finalizado!</h2>
        <p>Puntaje obtenido: {score}</p>
        <button onClick={restartGame}>Reiniciar juego</button>
      </div>
    );
  };

  // Muestra una pregunta
  const renderQuestion = () => {
    const question = questions[currentQuestion];
    const answers = [...question.incorrect_answers, question.correct_answer];

    // Ordena las respuestas aleatoriamente
    answers.sort(() => Math.random() - 0.5);

    const remainingQuestions = questions.length - currentQuestion - 1;

    return (
      <div>
        <h3>Remaining questions: {remainingQuestions}</h3>
        <div className="container-dif">
          <p>
            Category: <span style={{fontWeight: "bold"}}>{question.category}</span>
          </p>
          <p>
            Difficulty: <span style={{fontWeight: "bold"}}>{question.difficulty}</span>
          </p>
        </div>
        <h2>Question:</h2>
        <h4>{he.decode(question.question)}</h4>
        <ul className="answers-list">
          {answers.map((answer, index) => {
            let answerClass = "answer";

            if (selectedAnswer === answer) {
              if (answer === correctAnswer) {
                answerClass += " correct";
              } else {
                answerClass += " incorrect";
              }
            }

            return (
              <li key={index} className={answerClass} onClick={() => handleAnswerSelect(answer)}>
                {he.decode(answer)}
              </li>
            );
          })}
        </ul>
        {selectedAnswer && (
          <>
            <p>Tu respuesta: {he.decode(selectedAnswer)}</p>
            {selectedAnswer !== correctAnswer && (
              <p>Respuesta correcta: {he.decode(correctAnswer)}</p>
            )}
          </>
        )}
        <button className="next-button" onClick={handleNextQuestion}>
          Next question
        </button>
      </div>
    );
  };

  return (
    <div className="game-container">
      {questions.length > 0 && !showResult && renderQuestion()}
      {showResult && renderResult()}
    </div>
  );
};

export default App;
