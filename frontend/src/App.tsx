import {
  MouseEventHandler,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
type Coord = { x: number; y: number };

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const containerRef = useRef<HTMLDivElement>(null!);
  const lastRef = useRef<Coord>({ x: NaN, y: NaN });
  const viewportDimensions = useContainerDimensions(containerRef);

  const onMouseDown: MouseEventHandler<HTMLCanvasElement> = (e) => {
    if (!isLeftMouseButtonDown(e.buttons)) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    lastRef.current = {
      x: e.pageX - canvasRect.left,
      y: e.pageY - canvasRect.top,
    };
  };

  const onMouseMove: MouseEventHandler<HTMLCanvasElement> = (e) => {
    if (!isLeftMouseButtonDown(e.buttons)) return;

    const from = lastRef.current;
    if (!from) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const to = {
      x: e.pageX - canvasRect.left,
      y: e.pageY - canvasRect.top,
    };
    paint({
      element: canvasRef.current,
      from,
      to,
    });
    lastRef.current = to;
  };

  const onMouseEnter: MouseEventHandler<HTMLCanvasElement> = (e) => {
    if (!isLeftMouseButtonDown(e.buttons)) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();

    lastRef.current = {
      x: e.pageX - canvasRect.left,
      y: e.pageY - canvasRect.top,
    };
  };

  return (
    <>
      <div style={{ width: "90dvw", height: "90dvh" }} ref={containerRef}>
        <canvas
          height={viewportDimensions?.y}
          width={viewportDimensions?.x}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseEnter={onMouseEnter}
          ref={canvasRef}
          style={{ background: "skyblue" }}
        />
      </div>
    </>
  );
}

function useContainerDimensions(containerRef: RefObject<HTMLElement>) {
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
