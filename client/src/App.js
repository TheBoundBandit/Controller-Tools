import React from 'react';
import './App.css';

import { Chart, LinearScale, CategoryScale, PointElement, LineElement, LineController, Filler } from 'chart.js';

import PatternCreator from './pages/patternCreator';

Chart.register(LinearScale);
Chart.register(CategoryScale);
Chart.register(PointElement);
Chart.register(LineElement);
Chart.register(LineController);
Chart.register(Filler);

function App() {

  return (
    <>
    <PatternCreator />
    </>
  );
}

export default App;
