import React, { useState, useEffect } from "react";
import { useParams  } from "react-router-dom";

import { ReactComponent as CloseIcon } from "./icons/close-circle.svg";
import { ReactComponent as CheckIcon } from "./icons/check-circle.svg";

import Title from "./components/Title";

const groups = [
  {
    title: "Level",
    questions: [
      { value: "beginner", text: "Show me beginner courses" },
      { value: "intermediate", text: "Show me intermediate courses" },
      { value: "advanced", text: "Show me advanced courses" },
    ],
  },
  {
    title: "Duration",
    questions: [
      { value: "short", text: "Show me short courses (<5 weeks)" },
      { value: "medium", text: "Show me intermediate length courses (5-15 weeks)" },
      { value: "long", text: "Show me long courses (>15 weeks)" },
    ],
  },
  {
    title: "Price",
    questions: [
      { value: "free", text: "Show me free courses" },
      { value: "cheap", text: "Show me cheap courses (<$50)" },
      { value: "moderate", text: "Show me moderately priced courses ($50-$150)" },
      { value: "expensive", text: "Show me expensive courses (>$150)" },
    ],
  },
];


export default function Match() {
  const transitionDuration = 1000;

  const { topic } = useParams();

  const [ currentGroup, setCurrentGroup ] = useState(0);
  const [ currentQuestion, setCurrentQuestion ] = useState(0);
  const [ swipeDirection, setSwipeDirection ] = useState("");
  const [ swipeState, setSwipeState ] = useState(0);
  const [ groupRanges, setGroupRanges ] = useState({});

  const [ lastGroup, setLastGroup ] = useState(0);
  const [ lastQuestion, setLastQuestion ] = useState(0);

  const nextGroup = () => {
    setCurrentGroup(currentGroup + 1);
    setCurrentQuestion(0);
    setSwipeState(0);
  };

  const nextQuestion = () => {
    if (currentQuestion == groups[currentGroup].questions.length - 1) {
      nextGroup();
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const appendAnswers = (answer) => {
    setGroupRanges({ ...groupRanges, [groups[currentGroup].title]: [ ...(groupRanges[groups[currentGroup].title] || []), answer ] });
  };

  const swipeLeft = () => {
    setSwipeDirection("-");
    if (swipeState == 1) {
      nextGroup();
    } else {
      if (currentQuestion == groups[currentGroup].questions.length - 2) {
        appendAnswers(groups[currentGroup].questions[groups[currentGroup].questions.length - 1].value);
        nextGroup();
      } else {
        nextQuestion();
      }
    }
  };

  const swipeRight = () => {
    setSwipeState(1);
    appendAnswers(groups[currentGroup].questions[currentQuestion].value);
    setSwipeDirection("");
    nextQuestion();
  };

  useEffect(() => {
    if (lastGroup != currentGroup || lastQuestion != currentQuestion) {
      const timeout = setTimeout(() => {
        setLastGroup(currentGroup);
        setLastQuestion(currentQuestion);
      }, transitionDuration);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [ currentGroup, currentQuestion ]);

  const transitionClass =
    lastGroup == currentGroup && lastQuestion == currentQuestion ?
    `opacity-100 rotate-0 transition-opacity` :
    `opacity-0 ${swipeDirection}rotate-90 transition-all`;

  return (
    <div className="flex flex-col items-center flex-1">
      <Title subtitle={topic}>
        Find Your Match!
      </Title>

      <div className="w-full max-w-xl flex flex-col flex-1 px-4 py-8 overflow-hidden">
        { lastGroup < groups.length && lastQuestion < groups[lastGroup].questions.length ?
          <div className={`w-full flex flex-col justify-between flex-1 bg-gray-900 rounded-[50px] transform transition ease-in-out origin-[50%_120%] ${transitionClass}`} style={{ transitionDuration: `${transitionDuration}ms` }}>
            <h2 className="text-amber-500 text-center text-4xl px-8 py-4">{ groups[lastGroup].title }</h2>

            <div className="flex items-center justify-between px-4">
              <button className="p-4" onClick={() => swipeLeft()}>
                <CloseIcon className="fill-amber-500 w-12 h-12" />
              </button>
              <span className="text-white text-3xl md:text-5xl text-center">{ groups[lastGroup].questions[lastQuestion].text }</span>
              <button className="p-4" onClick={() => swipeRight()}>
                <CheckIcon className="fill-amber-500 w-12 h-12" />
              </button>
            </div>

            <div></div>
          </div>
          :
          <div>{ JSON.stringify(groupRanges) }</div>
        }
      </div>
    </div>
  )
}
