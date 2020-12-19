import { useEffect, useState } from "react";

const useWindowResize = () => {
  const [currentSize, setCurrentSize] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  useEffect(() => {
    const onWindowResize = () => {
      setCurrentSize({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    };

    window.addEventListener("resize", onWindowResize);

    return () => {
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

  return currentSize;
};

export default useWindowResize;
