export function countQuery(input: string[], query: string[]): number[] {
  return query.map((q) => input.filter((item) => item === q).length);
}

const INPUT = ['xc', 'dz', 'bbb', 'dz'];
const QUERY = ['bbb', 'ac', 'dz'];
const result = countQuery(INPUT, QUERY);
console.log(`OUTPUT = [${result.join(', ')}]`);
