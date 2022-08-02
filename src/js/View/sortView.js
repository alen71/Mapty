class sortView {
  sortBtn = document.querySelector('.sort-btn');

  constructor() {
    this.sortBtn.addEventListener('click', this.#toggleSortMenu);
    this.addSortsEventHandler();
  }

  #toggleSortMenu() {
    this.classList.toggle('opened');
  }

  addSortsEventHandler(handler) {
    document.querySelectorAll('.sort-option').forEach(sort => {
      sort.addEventListener('click', handler);
    });
  }

  sortWorkoutList(e, workouts) {
    const parentEl = e.target.parentElement;
    const sortArrowHolder = parentEl.querySelector('.sort-arr');
    const sortArrowIcon = parentEl.querySelector('.sort-arr i');
    const sortBy = parentEl.getAttribute('data-type');

    if (sortArrowHolder.classList.contains('arr-down')) {
      sortArrowHolder.classList.remove('arr-down');
      sortArrowHolder.classList.add('arr-up');
      sortArrowIcon.style.transform = 'rotate(180deg)';
    } else {
      sortArrowHolder.classList.add('arr-down');
      sortArrowHolder.classList.remove('arr-up');
      sortArrowIcon.style.transform = 'rotate(0)';
    }

    switch (sortBy) {
      case 'date':
        const dateSorted = sortArrowHolder.classList.contains('arr-up')
          ? workouts.sort(
              (a, b) => new Date(a.date).getTime() + new Date(b.date).getTime()
            )
          : workouts.sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            );
        return dateSorted;
      case 'distance':
        const distanceSorted = sortArrowHolder.classList.contains('arr-down')
          ? workouts.sort((a, b) => a.distance + b.distance)
          : workouts.sort((a, b) => a.distance - b.distance);
        return distanceSorted;
      case 'duration':
        const durationSorted = sortArrowHolder.classList.contains('arr-down')
          ? workouts.sort((a, b) => a.duration + b.duration)
          : workouts.sort((a, b) => a.duration - b.duration);
        return durationSorted;
      case 'pace':
        const paceSorted = sortArrowHolder.classList.contains('arr-down')
          ? workouts.sort((a, b) => {
              const valA = a.pace ? a.pace : a.speed;
              const valB = b.pace ? b.pace : b.speed;
              return valA + valB;
            })
          : workouts.sort((a, b) => {
              const valA = a.pace ? a.pace : a.speed;
              const valB = b.pace ? b.pace : b.speed;
              return valA - valB;
            });
        return paceSorted;
      case 'cadence':
        const cadenceSorted = sortArrowHolder.classList.contains('arr-down')
          ? workouts.sort((a, b) => a.cadence + b.cadence)
          : workouts.sort((a, b) => a.cadence - b.cadence);
        return cadenceSorted;
      case 'elevation':
        const elevationSorted = sortArrowHolder.classList.contains('arr-down')
          ? workouts.sort((a, b) => a.elevation + b.elevation)
          : workouts.sort((a, b) => a.elevation - b.elevation);
        return elevationSorted;
    }
  }

  fadeOutList() {
    document.querySelector('.workouts').classList.add('fadeOut');
  }

  fadeInList() {
    document.querySelector('.workouts').classList.remove('fadeOut');
  }
}

export default new sortView();
