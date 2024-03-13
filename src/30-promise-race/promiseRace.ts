export default function promiseRace<T>(promises: Promise<T>[]): Promise<unknown> {
  if (!promises.length) {
    throw new Error('No promise was passed');
  }

  return new Promise((resolve, reject) => {
    promises.forEach((p) => {
      p.then((res) => resolve(res)).catch((error) => reject(error));
    });
  });
}
