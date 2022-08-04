import { linear, Point } from "./sample";

export type AnimationCallback = (point: Point) => void
export type AnimationCanceller = (newDuration?: number) => void

export interface AnimationFunction {
  (cb: AnimationCallback): AnimationCanceller;
}

function computeFactor(points: [Point, Point], progress: number): number {
  const [a, b] = points;
  const l = b.x - a.x;
  return (progress - a.x) / l;
}

export function animate(points: Point[], duration: number, forever: boolean = true): AnimationFunction {

  return (cb) => {
    let i = 0;
    let cur: number = 0;
    let curTime: number | undefined = undefined;
    let handler: number | undefined = undefined;

    function run(progress: number) {
      let finalPoints: [Point, Point];
      while (points[i + 1].x < progress && i < points.length - 1) {
        i += 1;
      }
      if (i < points.length - 1) {
        finalPoints = [points[i], points[i + 1]];
      } else {
        finalPoints = [points[i], points[i]];
      }

      cb(linear(finalPoints, computeFactor(finalPoints, progress)));

      curTime = curTime ?? performance.now();
      handler = requestAnimationFrame((time) => {
        const diff = time - curTime!;
        curTime = time;
        cur += diff / duration;
        if (cur <= 1) {
          run(cur);
        } else if (forever) {
          cur = 0;
          i = 0;
          run(cur);
        }
      });
    }

    run(cur);

    return (newDuration?: number) => {
      if (typeof newDuration !== "undefined") {
        duration = newDuration;
      } else {
        if (typeof handler !== 'undefined') {
          cancelAnimationFrame(handler);
        }
      }
    };
  };
}
