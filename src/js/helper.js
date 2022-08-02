import { async } from 'regenerator-runtime';

export const validInputs = (...inputs) =>
  inputs.every(inp => Number.isFinite(inp));

export const positiveNums = (...inputs) => inputs.every(inp => inp > 0);

export const getDate = function (date) {
  // prettier-ignore
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return `${months[date.getMonth()]} ${date.getDate()}`;
};

export const findPopupByClassName = function (popups, id) {
  return popups.find(popup => {
    if (popup.className.includes(`id_${id}`)) {
      return popup;
    }
  });
};

export const findMarkerByClassName = function (markers, id) {
  return markers.find(marker => {
    if (marker.className.includes(`id_${id}`)) {
      return marker;
    }
  });
};
export const findShadowByClassName = function (shadows, id) {
  return shadows.find(shadow => {
    if (shadow.className.includes(`id_${id}`)) {
      return shadow;
    }
  });
};

export const AJAX = async function (url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    alert(err);
  }
};
