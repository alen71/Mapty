import { validInputs, positiveNums } from '../helper';
import View from './View';

const workouts = document.querySelector('.workouts');

class EdtiDeleteView extends View {
  addDeleteHandlers(handler) {
    const delBtns = document.querySelectorAll('.delete__btn');
    delBtns.forEach(btn =>
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        handler(e);
      })
    );
  }

  addDeleteHandler(handler) {
    document
      .querySelector('.delete__btn')
      .addEventListener('click', function (e) {
        e.preventDefault();
        handler(e);
      });
  }

  addEditHandlers(handler) {
    const editBtns = document.querySelectorAll('.edit__btn');
    editBtns.forEach(btn =>
      btn.addEventListener(
        'click',
        function (e) {
          this._edit(e, handler);
        }.bind(this)
      )
    );
  }

  addEditHandler(handler) {
    this.handler = handler;
    document.querySelector('.edit__btn').addEventListener(
      'click',
      function (e) {
        this._edit(e, handler);
      }.bind(this)
    );
  }

  _edit(e, handler) {
    e.preventDefault();

    const parentEl = event.target.closest('.workout');
    const id = parentEl.getAttribute('data-id');
    const editForm = parentEl.querySelector('.edit-form');

    const distanceVal = parentEl.querySelector('.workout-distance');
    const durationVal = parentEl.querySelector('.workout-duration');

    // Show edit form
    editForm.classList.toggle('editing');

    editForm.querySelector('.form__input--distance').value =
      distanceVal.textContent;
    editForm.querySelector('.form__input--duration').value =
      durationVal.textContent;

    if (editForm.classList.contains('running')) {
      const cadenceVal = parentEl.querySelector('.workout-cadence');
      editForm.querySelector('.form__input--cadence').value =
        cadenceVal.textContent;
    } else {
      const elevationVal = parentEl.querySelector('.workout-elevation');
      editForm.querySelector('.form__input--elevation').value =
        elevationVal.textContent;
    }

    editForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let data;

      const distance = editForm.querySelector('.form__input--distance').value;
      const duration = editForm.querySelector('.form__input--duration').value;

      if (parentEl.classList.contains('workout--running')) {
        const cadence = editForm.querySelector('.form__input--cadence').value;

        if (
          !validInputs(distance, duration, cadence) &&
          !positiveNums(distance, duration, cadence)
        )
          return;

        data = { id, distance, duration, cadence };

        const pace = duration / distance;

        parentEl.querySelector('.workout-cadence').textContent = cadence;
        parentEl.querySelector('.workout-pace').textContent =
          Math.round(pace * 10) / 10;
      } else {
        const elevation = editForm.querySelector(
          '.form__input--elevation'
        ).value;
        console.log(elevation);
        if (
          !validInputs(distance, duration, elevation) &&
          !positiveNums(distance, duration)
        )
          return;

        data = { id, distance, duration, elevation };

        const speed = distance / duration;

        parentEl.querySelector('.workout-elevation').textContent = elevation;
        parentEl.querySelector('.workout-speed').textContent =
          Math.round(speed * 10) / 10;
      }

      durationVal.textContent = duration;
      distanceVal.textContent = distance;

      editForm.classList.remove('editing');

      handler(data);
    });
  }
}

export default new EdtiDeleteView();
