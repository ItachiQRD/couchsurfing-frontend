export const fadeIn = (element) => {
    element.style.opacity = 0;
    let opacity = 0;
    const timer = setInterval(() => {
      if (opacity >= 1) {
        clearInterval(timer);
      }
      element.style.opacity = opacity;
      opacity += 0.1;
    }, 50);
  };