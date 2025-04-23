import { MouseEventHandler, useRef } from "react";
import "./App.css";
type Coord = { x: number; y: number };

function App() {
  const ref = useRef<HTMLCanvasElement>(null!);
  const lastRef = useRef<Coord>({ x: NaN, y: NaN });

  const onMouseDown: MouseEventHandler<HTMLCanvasElement> = (e) => {
    if (!isLeftMouseButtonDown(e.buttons)) return;
    const canvasRect = ref.current.getBoundingClientRect();
    lastRef.current = {
      x: e.pageX - canvasRect.left,
      y: e.pageY - canvasRect.top,
    };
  };

  const onMouseMove: MouseEventHandler<HTMLCanvasElement> = (e) => {
    if (!isLeftMouseButtonDown(e.buttons)) return;

    const from = lastRef.current;
    if (!from) return;

    const canvasRect = ref.current.getBoundingClientRect();
    const to = {
      x: e.pageX - canvasRect.left,
      y: e.pageY - canvasRect.top,
    };
    paint({
      element: ref.current,
      from,
      to,
    });
    lastRef.current = to;
  };

  const onMouseEnter: MouseEventHandler<HTMLCanvasElement> = (e) => {
    if (!isLeftMouseButtonDown(e.buttons)) return;
    const canvasRect = ref.current.getBoundingClientRect();

    lastRef.current = {
      x: e.pageX - canvasRect.left,
      y: e.pageY - canvasRect.top,
    };
  };

  return (
    <>
      <canvas
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseEnter={onMouseEnter}
        ref={ref}
        style={{ background: "white" }}
      />
    </>
  );
}

function isLeftMouseButtonDown(buttons: number) {
  return buttons % 2 === 1;
}

function paint({
  element,
  from,
  to,
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
