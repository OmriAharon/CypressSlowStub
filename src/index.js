import React from 'react';
import ReactDOM from 'react-dom';

class MyComponent extends React.Component {
  constructor(props){
    super(props);

    const xhr = new XMLHttpRequest();
    const xhr2 = new XMLHttpRequest();
    xhr.onload = () => {
      console.log('test-cors loaded');
    };
    xhr2.onload = () => {
      console.log('google loaded');
    };

    xhr.open('GET', 'https://www.test-cors.org/#?client_method=GET&client_credentials=false&server_enable=true&server_status=200&server_credentials=false&server_tabs=remote');
    xhr2.open('GET', 'https://www.google.com');
    xhr.send();
    xhr2.send();
  }
  render() {
    return <div data-cy="Test">Slow stubbing ;-(</div>;
  }
}

import(/* webpackChunkName: "HMR_AppContainer" */ 'react-hot-loader').then(({ AppContainer }) => {
  ReactDOM.render(
    <AppContainer>
      <MyComponent/>
    </AppContainer>,
    document.getElementById('root')
  );
});
