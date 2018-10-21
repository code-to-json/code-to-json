export interface SerializedPosition {
  pos: number;
  end: number;
}

export default function serializePosition(thing: {
  pos: number;
  end: number;
}): SerializedPosition {
  return { pos: thing.pos, end: thing.end };
}
