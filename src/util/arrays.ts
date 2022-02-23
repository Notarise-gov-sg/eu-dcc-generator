// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const arrayEquals = (a: any, b: any) =>
  Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, i) => v === b[i]);
