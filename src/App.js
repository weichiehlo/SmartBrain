import React, { Component } from 'react';
import './App.css';
import Clarifai from 'clarifai';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import Rank from './components/Rank/Rank'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import FaceRegonition from './components/FaceRegonition/FaceRegonition'
import SignIn from './components/SignIn/SignIn'
import Register from './components/Register/Register'



const app = new Clarifai.App({
  apiKey: '9173cd6f1c784792ab03221aee6a8c58'
 });

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
class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFacelocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
    console.log(this.state.box);
  }
  
  onInputChange = (event) => {
    this.setState({input: event.target.value});
    
    
  }

  onButtonSubmit = () =>{
    this.setState({imageUrl: this.state.input});
    app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
      .then(response => this.displayFaceBox(this.calculateFacelocation(response)))
      .catch(err => console.log(err));
  }

  onRouteChange = (route) =>{
    if(route === 'signout'){
      this.setState({isSignedIn:false})
    } else if(route === 'home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route: route});
  }

  render(){
    const { isSignedIn, imageUrl, route, box } = this.state;
    
    return (
      <div className="App">
        <Particles className='particles'
                params={particlesOptions}
              />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
       { route === 'home' 
        ? <div>
            <Logo />
            <Rank />
            <ImageLinkForm onInputChange = {this.onInputChange} 
                          onSubmit={ this.onButtonSubmit }/>
            <FaceRegonition box={box} imageUrl = {imageUrl}/>
          </div>
        : (
          route === 'signin' 
          ? <SignIn onRouteChange={this.onRouteChange}/>
          : <Register onRouteChange={this.onRouteChange}/>
        )
       }
        
  
      </div>
    );
  }

  }
 

export default App;
