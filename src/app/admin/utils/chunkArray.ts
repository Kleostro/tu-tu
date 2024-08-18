const chunkArray = (arr: number[], chunkSize: number): number[][] =>
  arr.reduce<number[][]>((acc, curr, index) => {
    if (index % chunkSize === 0) {
      acc.push([curr]);
    } else {
      acc[acc.length - 1].push(curr);
    }
    return acc;
  }, []);

export default chunkArray;
