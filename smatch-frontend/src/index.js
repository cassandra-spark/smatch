import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Home from './Home.js';
import Login from './Login.js';
import SignUp from './SignUp.js';
import Explore from './Explore.js';
import Match from './Match.js';
import Matches from './Matches.js';
import Choose from './Choose.js';
import Course from './Course.js';
import Forum from './Forum.js';
import Thread from './Thread.js';
import NewThread from './NewThread.js';
import Settings from './Settings.js';
import Visualization from './Visualization.js';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/" element={<Home />}>
            <Route index element={<Explore />} />
            <Route path="match/:topic" element={<Match />} />
            <Route path="matches" element={<Matches />} />
            <Route path="choose" element={<Choose />} />
            <Route path="course" element={<Course />} />
            <Route path="forum" element={<Forum />} />
            <Route path="forum/new" element={<NewThread />} />
            <Route path="forum/:thread_id" element={<Thread />} />
            <Route path="settings" element={<Settings />} />
            <Route path="visualization" element={<Visualization />} />
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
