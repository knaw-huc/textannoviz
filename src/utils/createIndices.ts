export const createIndices = (startIndex: number, endIndex: number) => {
  return Array.from(
    { length: endIndex + 1 - startIndex },
    (_, i) => i + startIndex
  );
};
