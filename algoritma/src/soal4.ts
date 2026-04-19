export function diagonalDifference(matrix: number[][]): number {
  const n = matrix.length;
  let primaryDiagonal = 0;
  let secondaryDiagonal = 0;

  for (let i = 0; i < n; i++) {
    primaryDiagonal += matrix[i][i];
    secondaryDiagonal += matrix[i][n - 1 - i];
  }

  return Math.abs(primaryDiagonal - secondaryDiagonal);
}

const matrix = [[1, 2, 0], [4, 5, 6], [7, 8, 9]];
const result = diagonalDifference(matrix);
console.log(`diagonal pertama = ${matrix[0][0]} + ${matrix[1][1]} + ${matrix[2][2]} = ${matrix[0][0] + matrix[1][1] + matrix[2][2]}`);
console.log(`diagonal kedua = ${matrix[0][2]} + ${matrix[1][1]} + ${matrix[2][0]} = ${matrix[0][2] + matrix[1][1] + matrix[2][0]}`);
console.log(`hasil = ${result}`);
