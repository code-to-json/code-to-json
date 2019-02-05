/**
 * Camelize a string
 *
 * @param text string to camelize
 * @public
 */

export function camelize(text: string): string {
  return text.replace(/^([A-Z])|[\s-_]+(\w)/g, (_match, p1, p2) => {
    if (p2) {
      return p2.toUpperCase();
    }
    return p1.toLowerCase();
  });
}
