import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createReduxStore } from './reduxStore/store';

it('renders without crashing', () => {
  const div = document.createElement('div');

  const reduxStore = createReduxStore();

  ReactDOM.render(
    <App reduxStore={reduxStore} />,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
