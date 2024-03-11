export const sleep = async (duration: number) =>
  new Promise((resolve) => setTimeout(resolve, duration));
