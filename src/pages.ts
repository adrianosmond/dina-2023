export type Guess = {
  rendered: string;
  guess: string;
};

type Page = {
  toGuess: Guess[];
  canContinueWithUnguessed: boolean;
  hasImage: boolean;
  lines: string[];
};

const REDACTED_CHAR = '-';

const makeGuess = (
  word: string,
  options?: { keepFirstLetter?: boolean; keepVowels?: boolean },
): Guess => {
  const defaultOptions = {
    keepFirstLetter: true,
    keepVowels: false,
  };

  const opts = {
    ...defaultOptions,
    ...options,
  };
  const guess = {
    rendered: '',
    guess: word.toLowerCase().replace(/[^a-z]/g, ''),
  };
  let w = word;
  if (opts.keepFirstLetter) {
    let i = 0;
    do {
      i += 1;
      w = word.substring(i);
      guess.rendered += word[i - 1];
    } while (!/[a-z]/.test(word[i - 1].toLowerCase()));
  }
  if (opts.keepVowels) {
    guess.rendered += w.replace(/[^aeiou"!'.?]/gi, REDACTED_CHAR);
  } else {
    guess.rendered += w.replace(/[a-zA-Z]/g, REDACTED_CHAR);
  }
  return guess;
};

// % = completely redacted
// ^ = first letter only visible
// $ = first letter and vowels visible

const pages: Page[] = [
  {
    toGuess: [makeGuess('Jog', { keepFirstLetter: false, keepVowels: false })],
    canContinueWithUnguessed: true,
    hasImage: true,
    lines: ['%Jog'],
  },
  {
    toGuess: [],
    canContinueWithUnguessed: false,
    hasImage: true,
    lines: [
      'Henk de Vries trained many $runners in the ^Westerpark.',
      'He taught them how to run and jump from morning until ^dark.',
      'Dina was the newest and the ^keenest to impress.',
      'She tried her hardest every week to improve and $progress.',
    ],
  },
  {
    toGuess: [],
    canContinueWithUnguessed: false,
    hasImage: true,
    lines: [
      "All the runners in Henk's $group were learning to ^exhale",
      '"Blow!" cried Henk with vigour, "Like big old ^humpback whale!"',
      "Now that you've been ^shown, you can practise on your own",
      'And your $lungs will fuel your running when the right muscles have ^grown."',
    ],
  },
  {
    toGuess: [],
    canContinueWithUnguessed: false,
    hasImage: true,
    lines: [
      'Dina started $practising — so keen she was to try',
      'But her aggressive inhaling sucked in a passing ^fly.',
    ],
  },
  {
    toGuess: [],
    canContinueWithUnguessed: false,
    hasImage: true,
    lines: [
      'Just then a handsome ^boy came by and said "Don\'t try to speak!',
      'But perhaps a book would help you to improve on your $technique?"',
      '"What a good ^idea!" she said, then took the book and went.',
      'Her $breathing and her heart rate quickened by the handsome ^gent',
    ],
  },
  {
    toGuess: [],
    canContinueWithUnguessed: false,
    hasImage: true,
    lines: [
      'A week went by and in week ^two the subject was "Your ^feet!',
      'The first part of your ^body to hit grass or mud or $street.',
      "Now that you've been shown, you can practise on your own",
      'And your legs will feel $buoyant when the right muscles have grown."',
    ],
  },
  {
    toGuess: [],
    canContinueWithUnguessed: false,
    hasImage: true,
    lines: [
      'Dina started practising and, $increasing her pace,',
      'She tiptoed down the street until she $tripped on a ^shoelace.',
    ],
  },
  {
    toGuess: [],
    canContinueWithUnguessed: false,
    hasImage: true,
    lines: [
      'Just then the boy came by and said "I don\'t mean to $offend...',
      '"But here\'s a book about folks who can %run for ^hours on end."',
      '"What a good idea!" She said, then took the book and went.',
      'A slight ^skip in her step thanks to the handsome mystery gent',
    ],
  },
  {
    toGuess: [],
    canContinueWithUnguessed: false,
    hasImage: true,
    lines: [
      'A week went by and in week three, the $topic changed to %knees',
      '"High!" said Henk with $gusto, "Higher if you please!"',
      "Now that you've been shown, you can practise on your own",
      'And your legs will rise like $rockets when the right muscles have grown."',
    ],
  },
  {
    toGuess: [],
    canContinueWithUnguessed: false,
    hasImage: true,
    lines: [
      'Dina started practising but ^kicking up her knees',
      "Emptied out her $pockets and she couldn't find her ^keys.",
    ],
  },
  {
    toGuess: [],
    canContinueWithUnguessed: false,
    hasImage: true,
    lines: [
      'Just then the boy came by and said $"Misplacing things is tough.',
      'So how about a gadget that can help you find your %stuff?"',
      '"What a good idea!" she said and nearly turned and went.',
      'But "Not so fast! %Wait up!" exclaimed the handsome mystery gent',
    ],
  },
  {
    toGuess: [],
    canContinueWithUnguessed: false,
    hasImage: true,
    lines: [
      "\"I'm %Adrian and I'm not sure but I have got a hunch",
      'The two of us would have some fun if we went out for %lunch."',
      '"What a good idea!" she said and off the ^couple went.',
      "Dina's ^hand in the hand of the handsome mystery gent.",
    ],
  },
  {
    toGuess: [],
    canContinueWithUnguessed: false,
    hasImage: false,
    lines: ['The End.'],
  },
];

pages.forEach((page) => {
  page.lines.forEach((line) => {
    line.split(' ').forEach((word) => {
      if (word.startsWith('%')) {
        page.toGuess.push(
          makeGuess(word.substring(1), {
            keepFirstLetter: false,
            keepVowels: false,
          }),
        );
      } else if (word.startsWith('^')) {
        page.toGuess.push(makeGuess(word.substring(1)));
      } else if (word.startsWith('$')) {
        page.toGuess.push(
          makeGuess(word.substring(1), {
            keepVowels: true,
          }),
        );
      }
    });
  });
});

export default pages;
