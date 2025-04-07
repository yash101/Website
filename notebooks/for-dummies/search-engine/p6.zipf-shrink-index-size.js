ALPHA = 0.02;
BETA = 0.1;
MIN_FREQUENCY = 3;

function buildIndex(corpus) {
  const frequencyMap = new Map();
  
  // Iterate over every story in the corpus
  for (const { text, title } of corpus) {
    // Tokenize the text
    const tokens = tokenize(normalize(text));
  
    // Add or increment the count of each token in the histogram map
    for (const token of tokens) {
      frequencyMap.set(token, (frequencyMap.get(token) || 0) + 1);
    }
  }

  const sortedTokens = Array
    .from(frequencyMap.entries())
    .filter(([token, frequency]) => frequency >= MIN_FREQUENCY)
    .sort((a, b) => b[1] - a[1]);
  
  const N = sortedTokens.length;
  console.log(`Dropping ${ALPHA * N} tokens from the beginning and ${BETA * N} tokens from the end`);
  sortedTokens.splice(0, Math.floor(ALPHA * N));
  sortedTokens.splice(sortedTokens.length - Math.floor(BETA * N), sortedTokens.length);
  
  console.log(`Number of tokens before filtering = ${frequencyMap.size}, and after = ${sortedTokens.length}`)
  console.log('First 50 tokens: ', sortedTokens.slice(0, 50));
  console.log('Last 50 tokens: ', sortedTokens.slice(-51, -1));

  // Build the index structure
  const index = new Map(sortedTokens.map(([token, _]) => [token, []]));

  // Add everything to the index
  for (const { text, title } of corpus) {
    const tokens = new Set(tokenize(normalize(text)));
    for (const token of tokens) {
      if (index.has(token)) {
        index.get(token).push(title);
      }
    }
  }

  return index;
}

function runQueries(index) {
  query(index, 'fox');
  query(index, 'the fox and the hare');
  query(index, 'the fox and the hair');
  query(index, 'hare');
  query(index, 'the fox ate the ass then played with the dog');
}

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

fetch(location.origin + '/objects/aesop-fables.json')
  .then(response => response.json())
  // Generate a histogram
  .then(corpus => {
    const index = buildIndex(corpus);
    runQueries(index);
  })
  .catch(e => {
    console.error(e);
  });
