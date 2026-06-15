import React, { useState, useEffect, useRef } from 'react';
import '../index.css';
import SortingLayout from './SortingLayout/SortingLayout.jsx';

export default function SortingPage() {

  const [array, setArray] = useState([45, 20, 80, 65, 30, 95, 10, 55]);
  const [algorithm, setAlgorithm] = useState('interchange');
  const [sortOrder, setSortOrder] = useState('asc');
  const [speed, setSpeed] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [history, setHistory] = useState([]);
  const [variables, setVariables] = useState([]);
  const [comparing, setComparing] = useState([]);
  const [swapping, setSwapping] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentLine, setCurrentLine] = useState(0);
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);

  const intervalRef = useRef(null);

  const generateInterchangeSteps = (arr) => {
    const stepsList = [];
    const arrayCopy = [...arr];
    const n = arrayCopy.length;

    let stepCounter = 1;

    for (let i = 0; i < n - 1; i++) {
      for (let j = i + 1; j < n; j++) {

        stepsList.push({
          step: stepCounter++,
          description: `So sánh a[${i}]=${arrayCopy[i]} và a[${j}]=${arrayCopy[j]}`,
          array: [...arrayCopy],
          comparing: [i, j],
          swapping: [],
          sorted: [],
          currentLine: 4,
          variables: [
            { name: "i", value: i },
            { name: "j", value: j },
          ],
        });

        if (arrayCopy[i] > arrayCopy[j]) {

          [arrayCopy[i], arrayCopy[j]] =
          [arrayCopy[j], arrayCopy[i]];

          stepsList.push({
            step: stepCounter++,
            description: `Hoán đổi a[${i}] và a[${j}]`,
            array: [...arrayCopy],
            comparing: [],
            swapping: [i, j],
            sorted: [],
            currentLine: 5,
            variables: [
              { name: "i", value: i },
              { name: "j", value: j },
            ],
          });
        }
      }

      stepsList.push({
        step: stepCounter++,
        description: `Kết thúc vòng lặp i=${i}`,
        array: [...arrayCopy],
        comparing: [],
        swapping: [],
        sorted: [...Array(i + 1).keys()],
        currentLine: 2,
        variables: [{ name: "i", value: i }],
      });
    }

    stepsList.push({
      step: stepCounter++,
      description: "Mảng đã sắp xếp hoàn chỉnh",
      array: [...arrayCopy],
      comparing: [],
      swapping: [],
      sorted: [...Array(n).keys()],
      currentLine: -1,
      variables: [],
    });

    return stepsList;
  };

  const applyStep = (step) => {
    if (!step) return;

    setArray(step.array);
    setComparing(step.comparing || []);
    setSwapping(step.swapping || []);
    setSorted(step.sorted || []);
    setCurrentLine(step.currentLine || 0);
    setVariables(step.variables || []);

    setHistory(prev => {

      const exists = prev.some(
        h => h.step === step.step
      );

      if (exists) return prev;

      return [
        ...prev,
        {
          step: step.step,
          description: step.description,
          array: step.array,
        }
      ];
    });
  };

  const initializeSteps = (newArray) => {

    const newSteps =
      generateInterchangeSteps(newArray);

    setSteps(newSteps);
    setStepIndex(0);

    if (newSteps.length > 0) {

      applyStep(newSteps[0]);

    }
  };

  useEffect(() => {

    initializeSteps(array);

  }, [algorithm]);

  useEffect(() => {

    if (
      isRunning &&
      stepIndex < steps.length - 1
    ) {

      intervalRef.current = setTimeout(() => {

        const nextIndex = stepIndex + 1;

        setStepIndex(nextIndex);

        applyStep(
          steps[nextIndex]
        );

      }, Math.max(100, 1000 / speed));

    }
    else if (
      stepIndex >= steps.length - 1
    ) {

      setIsRunning(false);

    }

    return () =>
      clearTimeout(intervalRef.current);

  }, [isRunning, stepIndex, steps, speed]);

  const handleStart = () => {

    if (stepIndex < steps.length - 1) {

      setIsRunning(true);

    }
  };

  const handlePause = () =>
    setIsRunning(false);

  const handleReset = () => {

    setIsRunning(false);

    const defaultArray =
      [45, 20, 80, 65, 30, 95, 10, 55];

    setArray(defaultArray);

    initializeSteps(defaultArray);
  };

  const handleStepForward = () => {

    if (isRunning) return;

    if (stepIndex < steps.length - 1) {

      const nextIndex = stepIndex + 1;

      setStepIndex(nextIndex);

      applyStep(
        steps[nextIndex]
      );
    }
  };

  const handleArrayInput = (newArray) => {

    setIsRunning(false);

    setArray(newArray);

    initializeSteps(newArray);
  };

  const handleRandomArray = () => {

    const random =
      Array.from(
        { length: 8 },
        () => Math.floor(Math.random() * 90) + 10
      );

    handleArrayInput(random);
  };

  const handleSortOrderChange = () => {

    setSortOrder(prev =>
      prev === 'asc'
        ? 'desc'
        : 'asc'
    );
  };

  return (

    <div className="app-container dark">

      <SortingLayout

        isRunning={isRunning}

        algorithm={algorithm}

        sortOrder={sortOrder}

        speed={speed}

        onStart={handleStart}

        onPause={handlePause}

        onReset={handleReset}

        onAlgorithmChange={setAlgorithm}

        onSortOrderChange={handleSortOrderChange}

        onSpeedChange={setSpeed}

        onArrayInput={handleArrayInput}

        onRandomArray={handleRandomArray}

        onStepForward={handleStepForward}

        canStepForward={
          !isRunning &&
          stepIndex < steps.length - 1
        }

        array={array}

        comparing={comparing}

        swapping={swapping}

        sorted={sorted}

        currentIndex={currentIndex}

        currentLine={currentLine}

        history={history}

        variables={variables}

      />

    </div>
  );
}