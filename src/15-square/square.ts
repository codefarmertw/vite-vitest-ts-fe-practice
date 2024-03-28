interface Array<T extends number> {
  square(): T[];
}

Array.prototype.square = function <T extends number>(): T[] {
  return this.map<T>((item: T) => (item * item) as T);
};
