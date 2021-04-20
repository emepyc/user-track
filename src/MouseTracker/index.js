import { useState, useEffect } from "react";

function useMousePosition(targetId) {
  const [clicked, setClicked] = useState(false);
  const [mousePosition, setMousePosition] = useState({
    time: null,
    x: null,
    y: null,
  });

  const updateClicked = ev => {
    setClicked(true);
  };

  const updateMousePosition = ev => {
    setClicked(false);
    if (ev.target.tagName === 'svg') {
      setMousePosition({
        time: new Date().getTime(),
        x: ev.layerX,
        y: ev.layerY,
      });
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("click", updateClicked);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("click", updateClicked);
    }
  }, []);

  return {
    position: mousePosition,
    clicked,
  };
}

export default useMousePosition;

function TrackMouseTimer({onTick}) {
  const [seconds, setSeconds] = useState(1);
  const [mousePosition, setMousePosition] = useState({target: null, x: null, y: null});

  const updateMousePosition = ev => {
    setMousePosition({
      target: ev.target,
      x: ev.clientX,
      y: ev.clientY,
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      onTick(mousePosition);
      setSeconds(seconds + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    }
  })

  useEffect(() => {
    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    }
  });
  return null;
}

export {
  TrackMouseTimer,
}
