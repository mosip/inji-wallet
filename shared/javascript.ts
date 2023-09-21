export function groupBy<T>(array: T[], predicate: (T) => boolean) {
  const trueElements = [];
  const falseElements = [];

  array?.forEach((e) => {
    if (predicate(e)) {
      trueElements.push(e);
    } else {
      falseElements.push(e);
    }
  });

  return [trueElements, falseElements];
}
