export default abstract class BaseError<Brand extends string> extends Error {
  public abstract readonly kind: Brand;
}
