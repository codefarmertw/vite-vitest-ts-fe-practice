// solution 1. array methods - reduce
const deduplicationWithReduce = (arr: number[]) =>
  arr.reduce<number[]>((accu, curr) => {
    if (!accu.includes(curr)) {
      accu.push(curr);
    }

    return accu;
  }, []);

// solution 2. object map
const deduplicationWithObject = (arr: number[]) => {
  const bufferMap: Record<number, boolean> = {};

  return arr.reduce<number[]>((accu, curr) => {
    if (!bufferMap[curr]) {
      accu.push(curr);
      bufferMap[curr] = true;
    }

    return accu;
  }, []);
};

// solution 3. set
const deduplicationWithSet = (arr: number[]) => [...new Set(arr)];

export { deduplicationWithReduce, deduplicationWithObject, deduplicationWithSet };
