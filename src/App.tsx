import PixelatedImage from './components/PixelatedImage/PixelatedImage';
import GuessForm from './components/GuessForm/GuessForm';
import usePageData from './usePageData';

const App = () => {
  const {
    currentPage,
    hasImage,
    totalToGuess,
    totalLeftToGuess,
    lines,
    canGoBack,
    canGoForward,
    goBack,
    goForward,
    guessWord,
  } = usePageData();

  const pixelation =
    2 + (totalToGuess > 1 ? totalLeftToGuess * (10 / totalToGuess) : 0);

  return (
    <div
      className="relative flex flex-col gap-6 items-center min-h-screen p-6"
      data-page-id={currentPage}
    >
      {hasImage && (
        <PixelatedImage
          src={`/images/page${currentPage}.avif`}
          pixelation={pixelation}
          className="image"
        />
      )}
      <div className="words">
        {lines.map((line, lineIdx) => (
          <p key={`${currentPage}-${lineIdx}`}>{line}</p>
        ))}
      </div>
      <GuessForm
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        goBack={goBack}
        goForward={goForward}
        guessWord={guessWord}
        totalLeftToGuess={totalLeftToGuess}
        totalToGuess={totalToGuess}
      />
    </div>
  );
};

export default App;
