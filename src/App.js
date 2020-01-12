import React from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import Rank from './components/Rank/Rank'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Particles from 'react-particles-js';

const particlesOptions = {
  particles: {
    number:{
      value: 30,
      density: {
        enable: true,
        value_area: 100
      }
    }
  }
}
function App() {
  return (
    <div className="App">
      <Particles className='particles'
              params={particlesOptions}
            />
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm />
      {/* <FaceRegonitop /> */}

    </div>
  );
}

export default App;
