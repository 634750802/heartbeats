export type Point = { x: number, y: number }

export function sample(g: SVGGeometryElement, precision: number = 0.1): Point[] {
  const res: Point[] = [];
  const length = g.getTotalLength();
  let i: number;
  for (i = 0; i < length; i += precision) {
    const { x, y } = g.getPointAtLength(i);
    res.push({ x, y });
  }

  if (i > length) {
    const { x, y } = g.getPointAtLength(length);
    res.push({ x, y });
  }

  return res;
}

export function sampleAll(list: SVGGeometryElement[], precision: number = 0.1): Point[] {
  return list.flatMap(g => sample(g, precision));
}

export type SampledStatistics = {
  min: Point
  max: Point
  size: Point
}

export function statistics(points: Point[], scale: number = 1): SampledStatistics {
  const max: Point = { x: Number.MIN_VALUE, y: Number.MIN_VALUE };
  const min: Point = { x: Number.MAX_VALUE, y: Number.MAX_VALUE };

  points.forEach(point => {
    min.x = Math.min(min.x, point.x);
    min.y = Math.min(min.y, point.y);
    max.x = Math.max(max.x, point.x);
    max.y = Math.max(max.y, point.y);
  });

  return {
    min: {
      x: min.x * scale,
      y: min.y * scale,
    },
    max: {
      x: max.x * scale,
      y: max.y * scale,
    },
    size: {
      x: (max.x - min.x) * scale,
      y: (max.y - min.y) * scale,
    },
  };
}

export function normalize(points: Point[]): Point[] {
  const { min: { x: minX, y: minY }, max: { x: maxX, y: maxY } } = statistics(points);
  const lx = maxX - minX;
  const ly = maxY - minY;
  return points.map(({ x, y }) => ({
    x: (x - minX) / lx,
    y: (y - minY) / ly,
  }));
}


export function linear(points: [Point, Point], factor: number): Point {
  const r = 1 - factor;
  return {
    x: points[0].x * r + points[1].x * factor,
    y: points[0].y * r + points[1].y * factor,
  };
}