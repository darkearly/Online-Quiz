import { useState, useEffect } from "react";
import { resultInitialState } from "./constants";

const Quiz = ({ questions }) => {
  const [currentQuestion, setCurrentQustion] = useState(0);
  const [answerIdx, setAnswerIdx] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [result, setResult] = useState(resultInitialState);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20); // 30 seconds timer for each question

  const { question, choices, correctAnswer } = questions[currentQuestion];

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    // If time runs out, move to the next question
    if (timeLeft === 0) {
      onClickNext();
    }

    // Reset the timer whenever the current question changes
    return () => clearInterval(timer);
  }, [timeLeft, currentQuestion]);

  const onAnswerClick = (answer, index) => {
    setAnswerIdx(index);
    if (answer === correctAnswer) {
      setAnswer(true);
    } else {
      setAnswer(false);
    }
  };

  const onClickNext = () => {
    setAnswerIdx(null);
    setResult((prev) =>
      answer
        ? {
            ...prev,
            score: prev.score + 5,
            correctAnswers: prev.correctAnswers + 1,
          }
        : {
            ...prev,
            wrongAnswers: prev.wrongAnswers + 1,
          }
    );

    // Reset the timer for the next question
    setTimeLeft(20);

    if (currentQuestion !== questions.length - 1) {
      setCurrentQustion((prev) => prev + 1);
    } else {
      setCurrentQustion(0);
      setShowResult(true);
    }
  };

  const onTryAgain = () => {
    setResult(resultInitialState);
    setShowResult(false);
    setCurrentQustion(0);
    setTimeLeft(20); // Reset timer on retry
  };

  return (
    <div className="quiz-container">
      {!showResult ? (
        <>
          {/* Timer displayed in the top-left corner */}
          <div className="timer">
            Time Left: {timeLeft}s
          </div>

          <span className="active-questions-no">{currentQuestion + 1}</span>
          <span className="total-questions-no">/{questions.length}</span>
          <h2>{question}</h2>
          <ul>
            {choices.map((answer, index) => (
              <li
                onClick={() => onAnswerClick(answer, index)}
                key={answer}
                className={answerIdx === index ? "select-answer" : null}
              >
                {answer}
              </li>
            ))}
          </ul>
          <div className="footer">
            <button onClick={onClickNext} disabled={answerIdx == null}>
              {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </>
      ) : (
        <div className="result">
          <h3>Result</h3>
          <p>
            Total Questions:<span>{questions.length}</span>
          </p>
          <p>
            Total Score:<span>{result.score}</span>
          </p>
          <p>
            Correct Answers:<span>{result.correctAnswers}</span>
          </p>
          <p>
            Wrong Answers:<span>{result.wrongAnswers}</span>
          </p>
          <button onClick={onTryAgain}>Try again</button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
