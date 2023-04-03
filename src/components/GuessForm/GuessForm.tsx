import { ChangeEventHandler, KeyboardEventHandler, useState } from 'react';

type GuessFormProps = {
  canGoBack: boolean;
  canGoForward: boolean;
  goBack: () => void;
  goForward: () => void;
  guessWord: (g: string) => void;
  totalLeftToGuess: number;
  totalToGuess: number;
};

const GuessForm = ({
  canGoForward,
  canGoBack,
  goBack,
  goForward,
  guessWord,
  totalLeftToGuess,
  totalToGuess,
}: GuessFormProps) => {
  const [guess, setGuess] = useState('');
  const modifiedGuess = guess.toLowerCase().replace(/[^a-z]/g, '');

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) =>
    setGuess(e.target.value);

  const handleKeyUp: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      guessWord(modifiedGuess);
      setGuess('');
    }
  };

  return (
    <div className="absolute bottom-2 left-0 right-0 flex items-center justify-between text-sm">
      <button
        disabled={!canGoBack}
        onClick={goBack}
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
        className={[
          'border border-gray-500 px-2 py-1',
          totalLeftToGuess > 0 ? '' : 'opacity-0',
        ].join(' ')}
      />
      <button
        disabled={!canGoForward}
        onClick={goForward}
        className={[
          'w-20 p-2',
          !canGoForward ? '' : 'cursor-pointer',
          totalToGuess > 0 || canGoForward ? '' : 'opacity-0',
        ].join(' ')}
      >
        {canGoForward ? (
          <>
            Next
            <br />
            page
          </>
        ) : (
          <>
            {totalLeftToGuess} / {totalToGuess} needed
          </>
        )}
      </button>
    </div>
  );
};

export default GuessForm;
