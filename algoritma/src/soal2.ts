export function longest(sentence: string): string {
  const words = sentence.split(' ');
  let result = words[0];

  for (let i = 1; i < words.length; i++) {
    if (words[i].length > result.length) {
      result = words[i];
    }
  }

  return result;
}

const sentence = 'Saya sangat senang mengerjakan soal algoritma';
const result = longest(sentence);
console.log(`${result}: ${result.length} character`);
