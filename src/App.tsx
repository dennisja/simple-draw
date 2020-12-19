import * as React from "react";
import rough from "roughjs/bin/rough";
import useWindowResize from "./hooks/useWindowResize";

type Coordinates = { x1: number; y1: number; x2: number; y2: number };

const roughGenerator = rough.generator();

const drawLine = ({ x1, y1, x2, y2 }: Coordinates) => {
  return roughGenerator.line(x1, y1, x2, y2);
};

const drawRectangle = ({ x1, y1, x2, y2 }: Coordinates) => {
  return roughGenerator.rectangle(x1, y1, x2 - x1, y2 - y1);
};

export default function App() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const windowSize = useWindowResize();
  const [coordinates, setCoordinates] = React.useState<Coordinates[]>([]);

  React.useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d")!;

    // clear canvas
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // draw all elements
    const roughCanvas = rough.canvas(canvas);
    coordinates.forEach((coordinate) => {
      roughCanvas.draw(drawLine(coordinate));
    });
  }, [coordinates]);

  const handleMouseDown = React.useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      setIsDrawing(true);

      const { clientX, clientY } = event;
      const newCoordinates = {
        x1: clientX,
        x2: clientX,
        y1: clientY,
        y2: clientY,
      };
      setCoordinates((prevCoordinates) => [...prevCoordinates, newCoordinates]);
    },
    []
  );

  const handleMouseMove = React.useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;

      const { clientX, clientY } = event;
      setCoordinates((previousCoordinates) => {
        const prevCoordinatesCopy = previousCoordinates.slice();
        const lastCoordinate = prevCoordinatesCopy.pop()!;

        const updatedLastCoordinate = {
          ...lastCoordinate,
          x2: clientX,
          y2: clientY,
        };

        return [...prevCoordinatesCopy, updatedLastCoordinate];
      });
    },
    [isDrawing]
  );

  const handleMouseUp = React.useCallback(() => {
    setIsDrawing(false);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      {...windowSize}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
}
