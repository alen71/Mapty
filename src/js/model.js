// import { async } from 'regenerator-runtime';

import { extend } from 'leaflet';
import { async } from 'regenerator-runtime';
import { API_KEY } from './config';
import { AJAX, getDate } from './helper';

export const state = {
  position: {},
  workouts: [],
};

class Workout {
  date = new Date();
  id = +(Date.now() + '').slice(-10);

  constructor(coords, distance, duration, location, weatherIcon) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
    this.location = location;
    this.weatherIcon = weatherIcon;
  }

  _description() {
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(
      1
    )} on ${getDate(this.date)}`;
    return this.description;
  }
}

class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence, location, weatherIcon) {
    super(coords, distance, duration, location, weatherIcon);

    this.cadence = cadence;
    this.#calcPace();
    this._description();
  }

  #calcPace() {
    // min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';

  constructor(coords, distance, duration, elevation, location, weatherIcon) {
    super(coords, distance, duration, location, weatherIcon);

    this.elevationGain = elevation;
    this.#calcSpeed();
    this._description();
  }

  #calcSpeed() {
    // km/h
    this.speed = this.distance / this.duration;
    return this.speed;
  }
}

export const addNewWorkout = async function (formData) {
  try {
    // const {coords, distance, duration, variable } = formData;

    // if (!formData) return;

    const lat = formData.coords[0];
    const lng = formData.coords[1];

    const weatherData = await AJAX(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}`
    );

    const locationData = await AJAX(
      `https://restcountries.com/v3.1/alpha/${weatherData.sys.country}`
    );

    const { icon } = weatherData.weather[0];

    const location = `${weatherData.name}, ${locationData[0].name.common}`;

    if (Object.keys(formData)[3] === 'cadence') {
      const { coords, distance, duration, cadence } = formData;
      const workout = new Running(
        coords,
        distance,
        duration,
        cadence,
        location,
        icon
      );
      state.workouts.push(workout);
      persistWorkouts();
      return workout;
    }

    if (Object.keys(formData)[3] === 'elevation') {
      const { coords, distance, duration, elevation } = formData;
      const workout = new Cycling(
        coords,
        distance,
        duration,
        elevation,
        location,
        icon
      );
      state.workouts.push(workout);
      persistWorkouts();
      return workout;
    }
  } catch (err) {
    throw err;
  }
};

export const deleteWorkout = function (el) {
  const id = +el.target.closest('.workout').dataset.id;

  const index = state.workouts.findIndex(wrk => wrk.id === id);

  state.workouts.splice(index, 1);
  persistWorkouts();
};

// LocalStorage
const persistWorkouts = function () {
  localStorage.setItem('workouts', JSON.stringify(state.workouts));
};

export const getStoredWorkouts = function () {
  const data = JSON.parse(localStorage.getItem('workouts'));
  console.log(data);
  if (!data) return;

  state.workouts = data;
};

const resetLocalStorade = function () {
  localStorage.clear('workouts');
};
// resetLocalStorade();

// EDIT WORKOUT
export const editWorkout = function (formData) {
  console.log(formData);
  const id = +formData.id;
  const distance = +formData.distance;
  const duration = +formData.duration;

  const targetedWorkout = state.workouts.find(wrk => wrk.id === id);
  const index = state.workouts.findIndex(wrk => wrk.id === id);

  if (Object.keys(formData)[3] === 'cadence') {
    const pace = duration / distance;

    targetedWorkout.distance = distance;
    targetedWorkout.duration = duration;
    targetedWorkout.cadence = +formData.cadence;
    targetedWorkout.pace = pace;
  }

  if (Object.keys(formData)[3] === 'elevation') {
    const speed = distance / duration;

    targetedWorkout.distance = distance;
    targetedWorkout.duration = duration;
    targetedWorkout.elevationGain = +formData.elevation;
    targetedWorkout.speed = speed;
  }

  state.workouts[index] = targetedWorkout;

  persistWorkouts();
};

// DELETE ALL WORKOUTS
export const claerAll = function () {
  state.workouts = [];
  resetLocalStorade();
};
