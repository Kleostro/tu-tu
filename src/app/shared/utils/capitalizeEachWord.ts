import makeFirstLetterUppercase from './makeFirstLetterUppercase';

export const capitalizeEachWord = (phrase: string): string =>
  phrase
    .split(' ')
    .map((word) => makeFirstLetterUppercase(word))
    .join(' ');
