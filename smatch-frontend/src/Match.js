import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { ReactComponent as CloseIcon } from "./icons/close-circle.svg";
import { ReactComponent as CheckIcon } from "./icons/check-circle.svg";

import Title from "./components/Title";
import { useGenerateClusters } from "./hooks";
import { selectTerms } from "./textProcessing";
import MatchContext from "./MatchContext";

const defaultGroups = [
  {
    title: "Level",
    questions: [
      { value: "Beginner", text: "Show me beginner courses" },
      { value: "Intermediate", text: "Show me intermediate courses" },
      { value: "Advanced", text: "Show me advanced courses" },
    ],
    skippable: true,
  },
  {
    title: "Duration",
    questions: [
      { value: "short", text: "Show me short courses (<5 weeks)" },
      { value: "medium", text: "Show me intermediate length courses (5-15 weeks)" },
      { value: "long", text: "Show me long courses (>15 weeks)" },
    ],
    skippable: true,
  },
  {
    title: "Price",
    questions: [
      { value: "free", text: "Show me free courses" },
      { value: "cheap", text: "Show me cheap courses (<$50)" },
      { value: "moderate", text: "Show me moderately priced courses ($50-$150)" },
      { value: "expensive", text: "Show me expensive courses (>$150)" },
    ],
    skippable: true,
  },
];

function createFilters(topic, groupRanges) {
  let filters = {};
  filters.category = topic;
  filters.levels = [ ...groupRanges.Level, "Any" ];

  // Assumes that there is at least one value in groupRanges.Duration
  filters.duration_min = 1000;
  filters.duration_max = 0;
  for (const duration of groupRanges.Duration) {
    switch (duration) {
      case "short":
        filters.duration_min = Math.min(filters.duration_min, 0);
        filters.duration_max = Math.max(filters.duration_max, 4);
        break;
      case "medium":
        filters.duration_min = Math.min(filters.duration_min, 5);
        filters.duration_max = Math.max(filters.duration_max, 15);
        break;
      case "long":
        filters.duration_min = Math.min(filters.duration_min, 16);
        filters.duration_max = Math.max(filters.duration_max, 1000);
    }
  }

  // Assumes that there is at least one value in groupRanges.Price
  filters.price_min = 10000;
  filters.price_max = 0;
  for (const price of groupRanges.Price) {
    switch (price) {
      case "free":
        filters.price_min = Math.min(filters.price_min, 0);
        filters.price_max = Math.max(filters.price_max, 0);
        break;
      case "cheap":
        filters.price_min = Math.min(filters.price_min, 1);
        filters.price_max = Math.max(filters.price_max, 49);
        break;
      case "moderate":
        filters.price_min = Math.min(filters.price_min, 50);
        filters.price_max = Math.max(filters.price_max, 150);
        break;
      case "expensive":
        filters.price_min = Math.min(filters.price_min, 151);
        filters.price_max = Math.max(filters.price_max, 10000);
    }
  }

  return filters;
}

function createClustersObject(clusters) {
  const clustersObject = {};
  for (const course of clusters) {
    if (!(course.cluster in clustersObject)) {
      clustersObject[course.cluster] = [];
    }
    clustersObject[course.cluster] = [ ...clustersObject[course.cluster], course ];
  }
  return clustersObject;
}

export default function Match() {
  const transitionDuration = 10;

  const { topic } = useParams();

  const [ groups, setGroups ] = useState(defaultGroups);
  const [ currentGroup, setCurrentGroup ] = useState(0);
  const [ currentQuestion, setCurrentQuestion ] = useState(0);
  const [ swipeDirection, setSwipeDirection ] = useState("");
  const [ swipeState, setSwipeState ] = useState(0);
  const [ groupRanges, setGroupRanges ] = useState({});

  const [ lastGroup, setLastGroup ] = useState(0);
  const [ lastQuestion, setLastQuestion ] = useState(0);

  const generateClusters = useGenerateClusters();
  const [ clusters, setClusters ] = useState();
  const [ terms, setTerms ] = useState();

  const { pushMatch } = useContext(MatchContext);
  const navigate = useNavigate();

  const nextGroup = async () => {
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
    if (swipeState == 1 && groups[currentGroup].skippable) {
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

  useEffect(async () => {
    if (currentGroup >= groups.length && !terms) {
      const filters = createFilters(topic, groupRanges);
      const result = await generateClusters(filters);
      if (result.status == 200) {
        const resJson = await result.json();
        setClusters(createClustersObject(resJson.clusters));
        setTerms(selectTerms(resJson.terms));
      }
    }
  }, [ currentGroup ]);

  const countVotes = (answers) => {
    const votes = {};
    for (const answer of answers) {
      if (!(answer in votes)) {
        votes[answer] = 0;
      }
      votes[answer] += 1;
    }
    return votes;
  }

  const getTies = (votes) => {
    let maxVotes = 0;
    for (const [ cluster, vote ] of Object.entries(votes)) {
      maxVotes = Math.max(maxVotes, vote);
    }
    return Object.entries(votes)
                 .filter(([ cluster, vote ] ) => vote == maxVotes)
                 .map(([ cluster, vote ] ) => cluster);
  }

  const maybeAddQuestionGroup = () => {
    let selectedClusters = Object.entries(terms);
    if (groups[groups.length - 1].title == "Recommendation") {
      const votes = countVotes(groupRanges["Recommendation"]);
      const ties = getTies(votes);
      if (ties.length == 1) {
        pushMatch(clusters[ties[0]]);
        navigate('/matches');
        return;
      }
      selectedClusters = selectedClusters.filter(([ cluster ]) => ties.includes(cluster));
    }

    let questions = [];
    for (let i = 0; i < 2; i++) {
      for (const [ cluster, clusterTerms ] of selectedClusters) {
        if (clusterTerms.length > 0) {
          questions = [ ...questions, {
            value: cluster,
            text: clusterTerms[i]
          } ];
        }
      }
    }

    let newGroup = {
      title: "Recommendation",
      questions, 
      skippable: false,
    };
    setGroups([ ...groups, newGroup ]);
  };

  useEffect(() => {
    if (terms) {
      maybeAddQuestionGroup();
    }
  }, [ terms, currentGroup ]);

  const transitionClass =
    lastGroup == currentGroup && lastQuestion == currentQuestion ?
    `opacity-100 rotate-0 transition-opacity` :
    `opacity-0 ${swipeDirection}rotate-90 transition-all`; // -rotate-90

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
          <></>
        }
      </div>
    </div>
  )
}
