import React from 'react';
import './App.scss';
import { icons } from './icons';
import './weather-icons.min.css'

export class App extends React.Component {
  state = { latitude: 0, longitude: 0, weather: {}, iconFinal: '' }

  constructor(props) {
    super(props);
    this.state = { latitude: 0, longitude: 0 };
    this.success = this.success.bind(this);
    this.getWeather = this.getWeather.bind(this);
    this.changeDegree = this.changeDegree.bind(this);
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(this.success, this.error);
  }

  changeDegree(e)  {
    switch (e.target.id) {
      case  'c': 
      document.querySelector('.weather__temp').textContent = Math.round(this.state.weather.main.temp - 273.15) + '℃';
        break;
        case  'k':
        document.querySelector('.weather__temp').textContent = Math.round(this.state.weather.main.temp) + 'K';
        break;
        case  'f': 
        document.querySelector('.weather__temp').textContent = Math.round((this.state.weather.main.temp - 273, 15) * 9 / 5 + 32) + '°F';
        break;
        default: 
        document.querySelector('.weather__temp').textContent = 'error';
        break;
    }
  }

  success(pos) {
    var crd = pos.coords;
    this.setState({ latitude: crd.latitude, longitude: crd.longitude });
    this.getWeather();
  };

  error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  };

  getWeather() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `https://api.openweathermap.org/data/2.5/weather?lat=${this.state.latitude}&lon=${this.state.longitude}&APPID=1120d9e68a9842cedcdeecdf460ff13b`);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          let resultsObj = JSON.parse(xhr.response);
          var prefix = 'wi wi-';
          var code = resultsObj.weather[0].id;
          var icon = icons[code].icon;
          if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
            icon = 'day-' + icon;
          }
          icon = prefix + icon;
          this.setState({ weather: resultsObj, iconFinal: icon });
        } else {
          console.error(xhr.response);
          alert('Error!');
        }
      }
    }
    xhr.send();
  }
  render() {
    return (
      <div className="block" >
        <span className='block__title'>Current Weather Service</span>
        {this.state.weather !== undefined &&
          <div className='weather'>
            <span className='weather__conditions'>{this.state.weather.weather[0].main}, {this.state.weather.weather[0].description} </span>
            <span className = 'weather__icon'><i className={this.state.iconFinal} id = 'icon'></i></span>
            <span className="weather__temp">{`${Math.round(this.state.weather.main.temp - 273.15)}℃` }</span>
            <div className="weather__degrees">
              <span id = 'k' className = 'weather__button' onClick = {this.changeDegree}>Kelvin</span>
              <span id = 'c' className = 'weather__button' onClick = {this.changeDegree}>Celsius</span>
              <span id = 'f' className = 'weather__button' onClick = {this.changeDegree}>Farenheit</span>
            </div>
            <span className="weather__location">Your location is {this.state.weather.name}, {this.state.weather.sys.country} </span>
          </div>
        }
        <span className="block__coords">Your coordinates are {Math.round(this.state.latitude * 100) / 100}, {Math.round(this.state.longitude * 100) / 100} </span>
      </div>
    );
  }
}

