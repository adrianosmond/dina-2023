import {
  ChangeEventHandler,
  KeyboardEventHandler,
  useEffect,
  useMemo,
  useState,
} from 'react';
import pages, { Guess } from './pages';

const makeGuessVersion = (word: string) =>
  word.toLowerCase().replace(/[^a-z]/g, '');

const App = () => {
  const [guess, setGuess] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  let initialUnguessed: Guess[][];
  try {
    const stored = sessionStorage.getItem('unguessed');
    initialUnguessed = stored
      ? JSON.parse(stored)
      : pages.map((p) => p.toGuess);
  } catch {
    initialUnguessed = pages.map((p) => p.toGuess);
  }
  const [unguessed, setUnguessed] = useState(initialUnguessed);
  const toGuess = unguessed[currentPage].map((g) => g.guess);
  const modifiedGuess = guess.toLowerCase().replace(/[^a-z]/g, '');

  useEffect(() => {
    sessionStorage.setItem('unguessed', JSON.stringify(unguessed));
  }, [unguessed]);

  const canGoBack = currentPage > 0;
  const canGoForward =
    currentPage < pages.length - 1 &&
    (toGuess.length === 0 || pages[currentPage].canContinueWithUnguessed);
  const pixelation =
    2 + toGuess.length * (10 / pages[currentPage].toGuess.length);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) =>
    setGuess(e.target.value);

  const handleKeyUp: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      if (toGuess.includes(modifiedGuess)) {
        setUnguessed((s) =>
          s.map((p, i) =>
            i !== currentPage ? p : p.filter((w) => w.guess !== modifiedGuess),
          ),
        );
      }
      setGuess('');
    }
  };

  const lines = useMemo(
    () =>
      pages[currentPage].lines.map((line) =>
        line
          .split(' ')
          .map((word) => {
            const guessableWord = unguessed[currentPage].find(
              (ug) => ug.guess === makeGuessVersion(word),
            );
            if (guessableWord) {
              return guessableWord.rendered;
            }
            return word.replace(/[%^$]/, '');
          })
          .join(' '),
      ),
    [currentPage, unguessed],
  );

  return (
    <div
      className="relative flex flex-col gap-6 items-center min-h-screen p-6"
      data-page-id={currentPage}
    >
      <svg
        style={
          currentPage === 0
            ? { width: '55vh', height: '55vh' }
            : { width: '45vh', height: '45vh' }
        }
      >
        <filter id="pixelate" x="0" y="0">
          <feFlood x="4" y="4" height="2" width="2" />
          <feComposite width={pixelation * 2} height={pixelation * 2} />
          <feTile result="a" />
          <feComposite in="SourceGraphic" in2="a" operator="in" />
          <feMorphology operator="dilate" radius={pixelation} />
        </filter>
        <image
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          {...(toGuess.length > 0 ? { filter: 'url(#pixelate)' } : {})}
          xlinkHref={`/images/page${currentPage}.avif`}
        />
      </svg>
      <div className="words">
        {lines.map((line, lineIdx) => (
          <p key={`${currentPage}-${lineIdx}`}>{line}</p>
        ))}
      </div>
      <div className="absolute bottom-2 left-0 right-0 flex items-center justify-between text-sm">
        <button
          disabled={!canGoBack}
          onClick={() => setCurrentPage((s) => s - 1)}
          className={[
            'w-20 p-2',
            !canGoBack ? 'text-gray-200' : 'cursor-pointer',
          ].join(' ')}
        >
          Previous page
        </button>
        <input
          value={guess}
          onChange={handleChange}
          onKeyUp={handleKeyUp}
          placeholder="Guess a word..."
          className="border border-gray-500 px-2 py-1"
        />
        <button
          disabled={!canGoForward}
          onClick={() => setCurrentPage((s) => s + 1)}
          className={['w-20 p-2', !canGoForward ? '' : 'cursor-pointer'].join(
            ' ',
          )}
        >
          {canGoForward ? (
            <>
              Next
              <br />
              page
            </>
          ) : (
            <>
              {toGuess.length} / {pages[currentPage].toGuess.length} needed
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default App;
