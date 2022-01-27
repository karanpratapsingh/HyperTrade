import React from 'react';
import ReactDOM from 'react-dom';

function App(): React.ReactElement {
  return <div>Hello Web!</div>;
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
