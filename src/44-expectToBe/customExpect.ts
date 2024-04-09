const customExpect = <T>(val: T) => {
  return {
    toBe: (expected: T) => {
      if (val === expected) {
        return true;
      } else {
        throw new Error('Not Equal');
      }
    },
    notToBe: (expected: T) => {
      if (val !== expected) {
        return true;
      } else {
        throw new Error('Equal');
      }
    },
  };
};

export default customExpect;
