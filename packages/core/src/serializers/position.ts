export interface SerializedPosition {
  pos: number;
  end: number;
}

/**
 * Serialize a position
 * @param thing a value with a position
 */
export default function serializePosition(thing: {
  pos: number;
  end: number;
}): SerializedPosition {
  return { pos: thing.pos, end: thing.end };
}
