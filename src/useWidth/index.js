import {useState, useEffect} from 'react';

export default function useWidth(container, defaultWidth = 750) {
  const [containerWidth, setContainerWidth] = useState(defaultWidth);

    const resize = () => {
        if (container.current) {
            setContainerWidth(container.current.offsetWidth);
        }
    };

  useEffect(() => {
    window.addEventListener('resize', resize);
    resize();
    return () => window.removeEventListener('resize', resize);
  }, [resize, container]);

  return containerWidth;
}
