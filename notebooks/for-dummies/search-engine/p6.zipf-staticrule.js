HYPERPARAMETER_MIN_SCORE = 0.2;

fetch(location.origin + '/objects/aesop-fables.json')
  .then(response => response.json())
  // Generate a histogram
  .then(corpus => {
    const histogram = new Map();
    // Iterate over every story in the corpus
    for (const article of corpus) {
      const {
        text,
        title
      } = article;
      
      // Tokenize the text
      const tokens = tokenize(normalize(text));
    
      // Add or increment the count of each token in the histogram map
      for (const token of tokens) {
        histogram.set(token, (histogram.get(token) || 0) + 1);
      }
    }

    // Score each word with Zipf's law
    for (const key of histogram.keys()) {
      histogram.set(key, 1.0 / histogram.get(key));
    }

    return {
      histogram,
      corpus
    };
  })
  // Index the corpus
  .then(({ histogram, corpus }) => {
    const index = new Map();

    for (const article of corpus) {
      const {
        text,
        title
      } = article;

      const tokens = new Set(tokenize(normalize(text)));
      for (const token of tokens) {
        // Skip indexing low-score tokens
        if ((histogram.get(token) || 0) < HYPERPARAMETER_MIN_SCORE) {
          continue;
        }
        
        if (!index.has(token)) {
          index.set(token, []);
        }
        index.get(token).push(title);
      }
    }

    return {
      index,
      corpus
    };
  })
  .then(({ index, corpus }) => {
    query(index, 'fox');
    query(index, 'the fox and the hare');
    query(index, 'the fox and the hair');
    query(index, 'hare');
    query(index, 'the fox ate the ass then played with the dog');
  })
  .catch(e => {
    console.error(e);
  });

// Query the index and print the results
function query(index, string) {
  if (!string || string === '') {
    console.error(`No search results for ${string}`);
  }

  const tokens = new Set(tokenize(normalize(string)));
  const unrankedResults = new Map();

  for (const token of tokens) {
    const hits = index.get(token) || [];
    for (const hit of hits) {
      const current = unrankedResults.get(hit) || 0;
      unrankedResults.set(hit, current + 1);
    }
  }

  const results = Array
    .from(unrankedResults.entries())
    .sort((a, b) => b[1] - a[1]);
  
  console.log(`Results for "${string}": ${results.length}`);
  for (const result of results.slice(0, Math.min(10, results.length))) {
    console.log(`\t${result[0]}: ${result[1]} hits`);
  }
}

function normalize(string) {
  return string
    .normalize('NFKC')
    .normalize('NFD')
    .replace(/(\p{M}|\p{Emoji_Modifier}|\p{P}\p{Sc}\p{Join_Control})/gu, '')
    .replace(/(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu, ' $1 ')
    .replace(/\p{White_Space}/gu, ' ')
    .replace(/(\p{Ll})(\p{Lu})/gu, '$1 $2')
    .replace(/(\p{N})(\p{L})/gu, '$1 $2')
    .replace(/(\p{L})(\p{N})/gu, '$1 $2')
    .replace(/(\.|\\|\+|\*|\?|\[|\]|\^|\$|\(|\)|\{|\}|\=|\!|\<|\>|\||\:|\-|\/|,|_|#|`|'|"|~|@|%|&)/g, ' ')
    .replace(/\s+/gu, ' ')
    .toLowerCase();
}

function tokenize(string) {
  return string
    .split(' ')
    .filter(str => str && str.length > 0);
}
