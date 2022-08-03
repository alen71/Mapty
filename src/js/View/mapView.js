import 'core-js/stable';
import 'leaflet';
import { MAP_ZOOM_LEVEL } from '../config.js';
import View from './View.js';
import workoutsListView from './workoutsListView.js';

import logo from 'url:../../img/icon.png';
import {
  findMarkerByClassName,
  findPopupByClassName,
  findShadowByClassName,
} from '../helper.js';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const overviewBtn = document.getElementById('overview');
const changeHandBtn = document.querySelector('.change-hand');

class mapView extends View {
  _map;
  constructor() {
    super();
    containerWorkouts.addEventListener('click', this.#moveToPopup.bind(this));
    changeHandBtn.addEventListener('click', this.#toggleScrollField);
  }

  #toggleScrollField() {
    const scrollField = changeHandBtn.parentElement;
    scrollField.classList.toggle('right-hand');
    scrollField.classList.toggle('left-hand');

    const controlZoomBar = document.querySelector('.leaflet-left');
    controlZoomBar.classList.toggle('move-right');
  }

  setOverviewHandler(handler) {
    overviewBtn.addEventListener('click', handler);
  }

  setOverview(workouts) {
    if (workouts.length === 0) {
      workoutsListView.colorNotification();
      return;
    }
    console.log(workouts);

    console.log('radi');

    const latitudes = workouts.map(wrk => wrk.coords[0]);
    const longitudes = workouts.map(wrk => wrk.coords[1]);

    const maxLat = Math.max(...latitudes);
    const minLat = Math.min(...latitudes);
    const maxLng = Math.max(...longitudes);
    const minLng = Math.min(...longitudes);

    this._map.fitBounds(
      [
        [maxLat, minLng],
        [minLat, maxLng],
      ],
      {
        padding: [70, 70],
      }
    );
  }

  loadMap(position) {
    const { latitude: lat, longitude: lng } = position.coords;
    const coords = [lat, lng];

    this._map = L.map('map').setView(coords, this.mapZoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this._map);

    // Map event handler
    this._map.on('click', mapE => {
      this._mapEvent = mapE;
      workoutsListView._showForm();
    });

    workoutsListView.workouts.forEach(wrk => this.renderMarker(wrk));
  }

  #moveToPopup(e) {
    if (!e.target.closest('.workout')) return;

    const id = +e.target.closest('.workout').dataset.id;

    const workout = workoutsListView.workouts.find(wrk => wrk.id === id);

    this._map.setView(workout?.coords, this.mapZoomLevel, {
      animation: true,
      pan: {
        duration: 1,
      },
    });
  }

  renderMarker(workout) {
    // prettier-ignore
    const myIcon = L.Icon.Default.prototype.options.className = `id_${workout.id}`;

    L.marker(workout.coords, { myIcon })
      .addTo(this._map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup id_${workout.id}`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup();
  }

  removeMarker(el) {
    const id = +el.target.closest('.workout').dataset.id;
    const popups = [...document.querySelectorAll('.leaflet-popup')];
    const markers = [...document.querySelectorAll('.leaflet-marker-icon')];
    const shadows = [...document.querySelectorAll('.leaflet-marker-shadow')];

    const targetedPopup = findPopupByClassName(popups, id);
    const targetedMarker = findMarkerByClassName(markers, id);
    const targetedShadow = findShadowByClassName(shadows, id);

    if (targetedPopup)
      targetedPopup
        .querySelector('.leaflet-popup-content-wrapper')
        .classList.add('invinsible');
    targetedMarker.classList.add('invinsible');
    targetedShadow.classList.add('invinsible');

    setTimeout(function () {
      targetedPopup.classList.add('invinsible');
    }, 1);
  }

  removeAllMarkers(workouts) {
    const popups = [...document.querySelectorAll('.leaflet-popup')];
    const markers = [...document.querySelectorAll('.leaflet-marker-icon')];
    const shadows = [...document.querySelectorAll('.leaflet-marker-shadow')];

    workouts.forEach(wrk => {
      const targetedPopup = findPopupByClassName(popups, wrk.id);
      const targetedMarker = findMarkerByClassName(markers, wrk.id);
      const targetedShadow = findShadowByClassName(shadows, wrk.id);

      targetedPopup
        .querySelector('.leaflet-popup-content-wrapper')
        .classList.add('invinsible');
      targetedMarker.classList.add('invinsible');
      targetedShadow.classList.add('invinsible');

      setTimeout(function () {
        targetedPopup.classList.add('invinsible');
      }, 1);
    });
  }
}

export default new mapView();
