import { MAP_ZOOM_LEVEL } from '../config';

const workoutsList = document.querySelector('.workouts');
const messageBox = document.querySelector('.message-box');
const messageContent = document.querySelector('.message-box .message');
const overlay = document.querySelector('.overlay');

export default class View {
  // _map;
  workout;
  _type;
  _mapEvent;
  workouts;
  mapZoomLevel = MAP_ZOOM_LEVEL;

  constructor() {
    document
      .querySelector('.close-message')
      .addEventListener('click', this.#closeMessageBox);
  }

  clearWorkList() {
    const allWorkouts = document.querySelectorAll('.workout');
    allWorkouts.forEach(wrk => wrk.remove());
  }

  #closeMessageBox() {
    messageBox.classList.add('invinsible');
    overlay.classList.add('invinsible');
  }

  renderError(errMessage) {
    messageBox.classList.remove('invinsible');
    overlay.classList.remove('invinsible');

    messageContent.textContent = errMessage;

    overlay.addEventListener('click', function () {
      messageBox.classList.add('invinsible');
      this.classList.add('invinsible');
    });
  }

  renderSpinner(parentEl) {
    document.querySelector('.spinner-box').classList.remove('invinsible');
  }

  removeSpinner() {
    document.querySelector('.spinner-box').classList.add('invinsible');
  }

  hideEmptyListText() {
    document.querySelector('.empty-list-text').classList.add('hidden');
  }

  showEmptyListText() {
    document.querySelector('.empty-list-text').classList.remove('hidden');
  }

  checkEmptyListText() {
    if (document.querySelector('.empty-list-text')) {
      return true;
    } else {
      return false;
    }
  }
}
