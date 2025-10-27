document.addEventListener("DOMContentLoaded", () => {



































































































    
  //--About-Festival--//

  function startSlider(slider1) {
    let counter = 1;
    setInterval(() => {
      document.querySelector(`.${slider1} #radio` + counter).checked = true;
      counter++;
      if (counter > 4) counter = 1;
    }, 5000);
  }
  startSlider("slider1");

  //--Review--//

  
  const LS_KEY = 'ourFestival.reviews.v1';

  const avgStarEl = document.getElementById('avgStar');
  const noReviewEl = document.getElementById('noReview');

  const viewportEl = document.getElementById('reviewViewport');
  const trackEl = document.getElementById('reviewTrack');
  const prevBtn = document.getElementById('prevBtn');

  const nextBtn = document.getElementById('nextBtn');

  let reviews = [];

  function loadReviews() {
    try {
      reviews = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
  
      if (!Array.isArray(reviews)) reviews = [];
    } catch (_) {
      reviews = [];
    }
  }

  function formatAvg(value) {
    return (Math.round(value * 10) / 10).toString().replace(/\.0$/, '');

  }

  function buildStars(score) {
    const full = Math.floor(score);
    const half = score - full >= 0.5 ? 1 : 0;

    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '☆' : '') + '☆'.repeat(empty);
  }

  function render() {

    if (reviews.length === 0) {
      avgStarEl.textContent = '0/5';
    } else {
      const sum = reviews.reduce((acc, r) => acc + Number(r.v || 0), 0);
      const avg = sum / reviews.length;
      avgStarEl.textContent = `${formatAvg(avg)}/5`;
    }


    trackEl.innerHTML = '';
    if (reviews.length === 0) {
      noReviewEl.hidden = false;
    } else {
      noReviewEl.hidden = true;
      reviews.forEach((r) => {
        const card = document.createElement('div');
        card.className = 'review-card';

        const starRow = document.createElement('div');
        starRow.className = 'review-stars-row';
        const stars = document.createElement('span');
        stars.className = 'stars';
        stars.textContent = buildStars(Number(r.v || 0));
        const score = document.createElement('span');
        score.textContent = ` ${r.v}/5`;
        starRow.appendChild(stars);




        starRow.appendChild(score);

        const msg = document.createElement('p');
        msg.className = 'review-message';
        msg.textContent = r.m || '';

        const name = document.createElement('div');
        name.className = 'review-name';
        name.textContent = r.n || 'Anonymous';

        card.appendChild(starRow);
        card.appendChild(msg);
        card.appendChild(name);
        trackEl.appendChild(card);





      });
    }

    updateArrows();
  }

  function getStep() {
    const first = trackEl.querySelector('.review-card');
    if (!first) return 0;

    const style = getComputedStyle(first);
    const width = first.getBoundingClientRect().width;

    const gap = parseFloat(getComputedStyle(trackEl).gap || '0');
    return width + gap;
  }



  function updateArrows() {
    const canScroll = trackEl.scrollWidth > viewportEl.clientWidth + 1; 
    if (!canScroll) {
      prevBtn.hidden = true;
      nextBtn.hidden = true;

      viewportEl.scrollLeft = 0;
      return;
    }
    prevBtn.hidden = viewportEl.scrollLeft <= 0;

    const maxScroll = trackEl.scrollWidth - viewportEl.clientWidth - 1;
    nextBtn.hidden = viewportEl.scrollLeft >= maxScroll;
  }

  function scrollByStep(direction) {
    const step = getStep();
    if (!step) return;
    const target = direction > 0
      ? Math.min(viewportEl.scrollLeft + step, trackEl.scrollWidth)
      : Math.max(viewportEl.scrollLeft - step, 0);
    viewportEl.scrollTo({ left: target, behavior: 'smooth' });
  }

  prevBtn.addEventListener('click', () => scrollByStep(-1));
  nextBtn.addEventListener('click', () => scrollByStep(1));

  viewportEl.addEventListener('scroll', () => {
    
    window.requestAnimationFrame(updateArrows);
  });

  window.addEventListener('resize', updateArrows);


  loadReviews();
  render();

});