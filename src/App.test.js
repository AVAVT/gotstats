import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createMockStore } from './testUtils';

it('renders without crashing', () => {
  const div = document.createElement('div');

  const reduxStore = createMockStore();

  ReactDOM.render(
    <App reduxStore={reduxStore} />,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
