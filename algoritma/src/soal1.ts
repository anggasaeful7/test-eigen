export function reverseAlphabet(str: string): string {
  const letters = str.replace(/[^a-zA-Z]/g, '');
  const nonLetters = str.replace(/[a-zA-Z]/g, '');
  const reversed = letters.split('').reverse().join('');
  return reversed + nonLetters;
}

const input = 'NEGIE1';
const result = reverseAlphabet(input);
console.log(`${input} -> ${result}`);
