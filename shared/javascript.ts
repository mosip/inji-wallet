export function groupBy<T>(array: T[], predicate: (arg0: T) => boolean) {
  const trueElements: T[] = [];
  const falseElements: T[] = [];

  array?.forEach(e => {
    if (predicate(e)) {
      trueElements.push(e);
    } else {
      falseElements.push(e);
    }
  });

  return [trueElements, falseElements];
}
