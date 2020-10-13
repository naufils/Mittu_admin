import React from 'react';
import axios from 'axios';
import config from './config';
import HomeScreen from './Components/Home';

axios.defaults.baseURL=config.localhost_url;

class App extends React.Component {

  render(){

    return (
      <div>
        <HomeScreen />        
      </div>
    )

  } 
}

export default App;

