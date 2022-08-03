import * as model from './model.js';
import mapView from './View/mapView.js';
import 'leaflet';
import workoutsListView from './View/workoutsListView.js';
import EditDeleteView from './View/editDeleteView.js';
import editDeleteView from './View/editDeleteView.js';
import sortView from './View/sortView.js';

import 'core-js/stable';
import 'regenerator-runtime';
import { async } from 'regenerator-runtime';

const constrolMap = function () {
  if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(
      pos => mapView.loadMap(pos),
      err => err
    );
};

const controlNewWorkout = async function (data) {
  try {
    if (!data) {
      workoutsListView.renderError(
        'Characters or symbols and negative numbers are NOT allowed for inputs, except negativ numbers on elevation field'
      );
      return;
    }

    workoutsListView.renderSpinner();

    const workout = await model.addNewWorkout(data);

    workoutsListView._newWorkout(workout);

    // Add Delete event handler to workouts
    editDeleteView.addDeleteHandler(deleteWorkControl);

    // remove empty list text if exist
    if (workoutsListView.checkEmptyListText())
      workoutsListView.hideEmptyListText();

    // Add Edit event handler to workouts
    editDeleteView.addEditHandler(editWorkControl);
  } catch (err) {
    console.log(err);
  }
};

const controlWorkoutsList = function (e, data) {
  workoutsListView.renderSpinner();

  model.getStoredWorkouts();

  if (model.state.workouts.length === 0) {
    workoutsListView.showEmptyListText();
  }

  workoutsListView.renderWorkout(model.state.workouts);

  setTimeout(() => {
    workoutsListView.removeSpinner();
  }, 500);
};

const deleteWorkControl = function (el) {
  // Render spinner
  workoutsListView.renderSpinner();

  setTimeout(() => {
    workoutsListView.removeSpinner();
  }, 300);

  // SetTimput is set to execute moveToPopup function first
  setTimeout(function () {
    // Delete target element
    model.deleteWorkout(el);

    // Delete marker imedietly
    mapView.removeMarker(el);

    // Clear all workouts from list
    workoutsListView.clearWorkList();

    // Render workouts
    workoutsListView.renderWorkout(model.state.workouts, true);

    // Add event handler to workouts
    editDeleteView.addDeleteHandlers(deleteWorkControl);
  }, 1);
};

const editWorkControl = function (data) {
  if (!data)
    workoutsListView.renderError(
      'Characters or symbols and negative numbers are NOT allowed for inputs, except negativ numbers on elevation field'
    );

  model.editWorkout(data);
};

// Sortind workouts list
const sortWorkoutsControll = function (event) {
  sortView.fadeOutList();

  // Get sorted workouts
  const sortedWorkouts = sortView.sortWorkoutList(event, model.state.workouts);

  // Render workouts
  setTimeout(function () {
    workoutsListView.clearWorkList();
    workoutsListView.renderWorkout(sortedWorkouts);
    sortView.fadeInList();
  }, 300);
};

const clearAllControll = function () {
  mapView.removeAllMarkers(model.state.workouts);
  workoutsListView.clearWorkList();
  workoutsListView.showEmptyListText();
  model.claerAll();
};

const overviewControll = function () {
  //   if (model.state.workouts.length === 0) return;

  mapView.setOverview(model.state.workouts);
};

const init = function () {
  constrolMap();
  controlWorkoutsList();
  workoutsListView.formEventHandler(controlNewWorkout);
  EditDeleteView.addEditHandlers(editWorkControl);
  EditDeleteView.addDeleteHandlers(deleteWorkControl);
  sortView.addSortsEventHandler(sortWorkoutsControll);
  workoutsListView.clearAllhandler(clearAllControll);
  mapView.setOverviewHandler(overviewControll);
};
init();

///////////////////////////////////////////////////////////
// Fixing flexbox gap property missing in some Safari versions
function checkFlexGap() {
  var flex = document.createElement('div');
  flex.style.display = 'flex';
  flex.style.flexDirection = 'column';
  flex.style.rowGap = '1px';

  flex.appendChild(document.createElement('div'));
  flex.appendChild(document.createElement('div'));

  document.body.appendChild(flex);
  var isSupported = flex.scrollHeight === 1;
  flex.parentNode.removeChild(flex);
  // console.log(isSupported);

  if (!isSupported) document.body.classList.add('no-flexbox-gap');
}
checkFlexGap();
