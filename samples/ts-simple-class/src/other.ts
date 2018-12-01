function add(a: string, b: string): number;
function add(a: number, b: number): number;
function add(a: string | number, b: string | number): number {
  const aa = typeof a === 'number' ? a : parseInt(a, 10);
  const bb = typeof b === 'number' ? b : parseInt(b, 10);
  return aa + bb;
}

export default add;
