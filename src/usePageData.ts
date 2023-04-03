import { useCallback, useEffect, useMemo, useState } from 'react';
import pages, { Guess } from './pages';

const redactUnguessedWords = (line: string, unguessed: Guess[]) =>
  line
    .split(' ')
    .map((word) => {
      if (!/^[%^$]/.test(word)) {
        return word;
      }
      const guessableWord = unguessed.find(
        (ug) => ug.guess === word.toLowerCase().replace(/[^a-z]/g, ''),
      );
      if (guessableWord) {
        return guessableWord.rendered;
      }
      return word.replace(/[%^$]/, '');
    })
    .join(' ');

const readUnguessedFromStorage = () => {
  let initialUnguessed: Guess[][];
  try {
    const stored = sessionStorage.getItem('unguessed');
    initialUnguessed = stored
      ? JSON.parse(stored)
      : pages.map((p) => p.toGuess);
  } catch {
    initialUnguessed = pages.map((p) => p.toGuess);
  }
  return initialUnguessed;
};

const usePageData = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [unguessed, setUnguessed] = useState(readUnguessedFromStorage());
  const toGuess = useMemo(
    () => unguessed[currentPage].map((g) => g.guess),
    [currentPage, unguessed],
  );
  const currentPageData = pages[currentPage];

  const guessWord = useCallback(
    (attempt: string) => {
      if (toGuess.includes(attempt)) {
        setUnguessed((allUnguessed) =>
          allUnguessed.map((words, pageIdx) =>
            pageIdx === currentPage
              ? words.filter((w) => w.guess !== attempt)
              : words,
          ),
        );
      }
    },
    [currentPage, toGuess],
  );

  const canGoBack = currentPage > 0;
  const goBack = useCallback(() => setCurrentPage((s) => s - 1), []);

  const canGoForward =
    currentPage < pages.length - 1 &&
    (toGuess.length === 0 || currentPageData.canContinueWithUnguessed);
  const goForward = useCallback(() => setCurrentPage((s) => s + 1), []);

  const lines = useMemo(
    () =>
      pages[currentPage].lines.map((line) =>
        redactUnguessedWords(line, unguessed[currentPage]),
      ),
    [currentPage, unguessed],
  );

  useEffect(() => {
    sessionStorage.setItem('unguessed', JSON.stringify(unguessed));
  }, [unguessed]);

  const value = useMemo(
    () => ({
      currentPage,
      hasImage: currentPageData.hasImage,
      goBack,
      goForward,
      totalLeftToGuess: toGuess.length,
      totalToGuess: currentPageData.toGuess.length,
      lines,
      canGoBack,
      canGoForward,
      guessWord,
    }),
    [
      currentPage,
      currentPageData.hasImage,
      currentPageData.toGuess.length,
      goBack,
      goForward,
      toGuess.length,
      lines,
      canGoBack,
      canGoForward,
      guessWord,
    ],
  );
  return value;
};

export default usePageData;
