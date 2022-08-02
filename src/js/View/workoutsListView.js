import mapView from './mapView';
import View from './View';
import { validInputs, positiveNums, AJAX } from '../helper.js';
import editDeleteView from './editDeleteView';
import { icon } from 'leaflet';

const htmlTag = document.querySelector('html');
const form = document.querySelector('.form');
const inputType = document.querySelector('.form__input--type');
const containerWorkouts = document.querySelector('.workouts');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const editWorkBtn = document.querySelector('.edit__btn');
const deleteWorkBtns = document.querySelectorAll('.delete__btn');
const overlay = document.querySelector('.overlay');
const confirmationPopup = document.getElementById('confirmation-popup');

class workoutsListView extends View {
  workouts = [];
  _map;
  constructor() {
    super();
    inputType.addEventListener('change', this._toggleElevationField);
  }

  _toggleElevationField() {
    inputCadence.parentElement.classList.toggle('form__row--hidden');
    inputElevation.parentElement.classList.toggle('form__row--hidden');
  }

  _showForm(mapE) {
    form.classList.remove('hidden');
    if (
      inputType.value === 'running' &&
      inputCadence.parentElement.classList.contains('form__row--hidden')
    )
      this._toggleElevationField();

    if (
      inputType.value === 'cycling' &&
      inputElevation.parentElement.classList.contains('form__row--hidden')
    )
      this._toggleElevationField();

    inputDistance.focus();
  }

  formEventHandler(handler) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const formData = this._getDataFromForm();
      handler(formData);
    });
  }

  _getDataFromForm() {
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = mapView._mapEvent.latlng;
    const coords = [lat, lng];

    if (type === 'running') {
      this._type = type;
      const cadence = +inputCadence.value;

      //  Validate data
      if (
        validInputs(distance, duration, cadence) &&
        positiveNums(distance, duration, cadence)
      ) {
        return { coords, distance, duration, cadence };
      } else {
        return;
      }
    }

    if (type === 'cycling') {
      this._type = type;
      const elevation = +inputElevation.value;
      if (
        validInputs(distance, duration, elevation) &&
        positiveNums(distance, duration, elevation)
      ) {
        return;
      } else {
        return { coords, distance, duration, elevation };
      }
    }
  }

  _newWorkout(workout) {
    this.workout = workout;
    this.workouts.push(workout);

    // Render workout
    this.renderWorkout([workout]);

    // Render marker
    mapView.renderMarker(workout);

    // Hide form
    this._hideForm();

    // remove Spinner
    this.removeSpinner();
  }

  _hideForm() {
    form.style.display = 'none';
    setTimeout(() => {
      form.style.display = 'grid';
      form.classList.add('hidden');
    }, 1000);
  }

  renderWorkout(workouts, update = false) {
    workouts.forEach(workout => {
      this.workouts.push(workout);

      this.markup(workout, update);
    });
  }

  markup(workout, update) {
    const iconSrc = `http://openweathermap.org/img/wn/${workout.weatherIcon}@2x.png`;
    let html = `
    <li class="workout workout--${workout.type}" data-id="${workout.id}">
      <h2 class="workout__title">${workout.description},<br class="break"> ${
      workout.location
    } <img class="weather-icon" src="${iconSrc}" alt="Weather icon"></h2>
      <div class="workout__btn-box">
          <button type="button" class="btn edit__btn">
            <span>Edit</span>
            <i class="fa-solid fa-pen"></i>
          </button>
          <button type="button" class="btn delete__btn">
            <span>Delete</span>
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      <div class="workout__details distance_details">
        <span class="workout__icon">${
          workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
        }</span>
        <span class="workout__value workout-distance">${workout.distance}</span>
        <span class="workout__unit">km</span>
      </div>
      <div class="workout__details duration_details">
        <span class="workout__icon">⏱</span>
        <span class="workout__value workout-duration">${workout.duration}</span>
        <span class="workout__unit">min</span>
      </div>`;

    if (workout.type === 'running')
      html += `
      <div class="workout__details speed_details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value workout-pace">${workout.pace?.toFixed(
          1
        )}</span>
        <span class="workout__unit">min/km</span>
      </div>
      <div class="workout__details last_details">
        <span class="workout__icon">🦶🏼</span>
        <span class="workout__value workout-cadence">${workout.cadence}</span>
        <span class="workout__unit">spm</span>
      </div>
    `;

    if (workout.type === 'cycling')
      html += `
      <div class="workout__details speed_details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value workout-speed">${workout.speed.toFixed(
          1
        )}</span>
        <span class="workout__unit">km/h</span>
      </div>
      <div class="workout__details last_details">
        <span class="workout__icon">⛰</span>
        <span class="workout__value workout-elevation">${
          workout.elevationGain
        }</span>
        <span class="workout__unit">m</span>
      </div>
    `;

    const editFormType =
      workout.type === 'running'
        ? `<div class="form__row">
        <label class="form__label">Cadence</label>
        <input class="form__input form__input--cadence" placeholder="step/min" />
      </div>
      <div class="form__row form__row--hidden">
        <label class="form__label">Elev Gain</label>
        <input class="form__input form__input--elevation" placeholder="meters" />
      </div>`
        : `<div class="form__row form__row--hidden">
        <label class="form__label">Cadence</label>
        <input class="form__input form__input--cadence" placeholder="step/min" />
      </div>
      <div class="form__row ">
        <label class="form__label">Elev Gain</label>
        <input class="form__input form__input--elevation" placeholder="meters" />
      </div>`;

    const btnType =
      workout.type === 'running' ? 'form__btn--running' : 'form__btn--cycling';

    html += `
      <form class="edit-form ${workout.type}">        
        <div class="form__row">
          <label class="form__label">Distance</label>
          <input class="form__input form__input--distance" placeholder="km" />
        </div>
        <div class="form__row">
          <label class="form__label">Duration</label>
          <input class="form__input form__input--duration" placeholder="min" />
        </div>
        ${editFormType}
        <button class="form__btn ${btnType}">Confirm</button>
      </form>
    </li>  
    `;

    // if (update) {
    //   containerWorkouts.insertAdjacentHTML('beforebegin', html);
    //   return;
    // }
    form.insertAdjacentHTML('afterend', html);
  }

  clearAllhandler(handler) {
    document.getElementById('clear-all').addEventListener('click', function () {
      if (document.querySelectorAll('.workout').length === 0) return;

      confirmationPopup.classList.remove('invinsible');
      overlay.classList.remove('invinsible');
      htmlTag.classList.add('scroll-lock');

      confirmationPopup.addEventListener('click', function (e) {
        if (e.target.getAttribute('id') === 'no') {
          confirmationPopup.classList.add('invinsible');
          overlay.classList.add('invinsible');
          htmlTag.classList.remove('scroll-lock');
        }

        if (e.target.getAttribute('id') === 'yes') {
          htmlTag.classList.remove('scroll-lock');
          confirmationPopup.classList.add('invinsible');
          overlay.classList.add('invinsible');
          handler();
        }
      });
    });
  }
}

export default new workoutsListView();
