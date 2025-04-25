import {
  MouseEvent,
  MouseEventHandler,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
type Coord = { x: number; y: number };

const CANVAS_INTERNAL_WIDTH = 800;
const CANVAS_INTERNAL_HEIGHT = 600;

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const lastRef = useRef<Coord>({ x: NaN, y: NaN });
  const canvasDimensions = useElementDimensions(canvasRef);
  const scalling = getElementScalling(canvasDimensions);

  const onMouseDown: MouseEventHandler<HTMLCanvasElement> = (e) => {
    if (!isLeftMouseButtonDown(e)) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    lastRef.current = {
      x: (e.clientX - canvasRect.left) / scalling,
      y: (e.clientY - canvasRect.top) / scalling,
    };
  };

  const onMouseMove: MouseEventHandler<HTMLCanvasElement> = (e) => {
    if (!isLeftMouseButtonDown(e)) return;

    const from = lastRef.current;
    if (!from) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const to = {
      x: (e.clientX - canvasRect.left) / scalling,
      y: (e.clientY - canvasRect.top) / scalling,
    };
    paint({
      element: canvasRef.current,
      from,
      to,
    });
    lastRef.current = to;
  };

  const onMouseEnter: MouseEventHandler<HTMLCanvasElement> = (e) => {
    if (!isLeftMouseButtonDown(e)) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();

    lastRef.current = {
      x: (e.clientX - canvasRect.left) / scalling,
      y: (e.clientY - canvasRect.top) / scalling,
    };
  };

  return (
    <>
      <canvas
        height={CANVAS_INTERNAL_HEIGHT}
        width={CANVAS_INTERNAL_WIDTH}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseEnter={onMouseEnter}
        ref={canvasRef}
        style={{
          background: "skyblue",
          width: `90dvw`,
          aspectRatio: "8 / 6",
          display: "block",
        }}
      />
    </>
  );
}

function getElementScalling(containerDimensions: Coord | undefined) {
  if (!containerDimensions) return 1;

  const xScalling = containerDimensions.x / CANVAS_INTERNAL_WIDTH;
  const yScalling = containerDimensions.y / CANVAS_INTERNAL_HEIGHT;

  return xScalling < yScalling ? xScalling : yScalling;
}

function useElementDimensions(containerRef: RefObject<HTMLElement>) {
  const [dimensions, setDimensions] = useState<Coord>();

  useEffect(() => {
    const containerElement = containerRef.current;

    const resizeObserver = new ResizeObserver((entries) => {
      const target = entries[0]?.target;
      if (!target) {
        setDimensions(undefined);
        return;
      }
      setDimensions({
        x: target.clientWidth,
        y: target.clientHeight,
      });
    });
    resizeObserver.observe(containerElement);

    return () => {
      if (containerElement) resizeObserver.unobserve(containerElement);
      else resizeObserver.disconnect();
    };
  }, [containerRef]);

  return dimensions;
}

function isLeftMouseButtonDown(e: MouseEvent) {
  return e.buttons % 2 === 1;
}

function paint({
  element,
  from, // internal cavas coordinates
  to, // internal canvas coordinates
  strokeStyle = "#000",
  lineWidth = 5,
}: {
  element: HTMLCanvasElement;
  from: { x: number; y: number };
  to: { x: number; y: number };
  lineWidth?: number;
  strokeStyle?: string;
}) {
  const ctx = element.getContext("2d");

  if (!ctx) return;

  ctx.beginPath();
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.lineJoin = "round";
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.closePath();
  ctx.stroke();
}

// function createRingBuffer<T>(length: number) {
//   const ringBuffer = Array<T>(length);

//   const getLast = () => ringBuffer.at(-1);
//   const getFirst = () => ringBuffer.at(0);
//   const getNth = (n: number) => ringBuffer.at(n);

//   const push = (item: T) => {
//     ringBuffer.splice(0, 1);
//     ringBuffer.push(item);
//   };

//   return { ringBuffer, getLast, getFirst, getNth, push };
// }

// function useGlobalMousePositionLog() {
//   useEffect(() => {
//     const log = (e: MouseEvent) => {
//       console.log("Global: ", { x: e.pageX, y: e.pageY });
//     };
//     window.addEventListener("mousedown", log, false);
//     return () => {
//       window.removeEventListener("mousedown", log, false);
//     };
//   }, []);
// }

export default App;
