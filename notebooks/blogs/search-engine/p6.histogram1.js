const histogram = new Map();

// Fetch Aesop's fables
fetch(location.origin + '/objects/aesop-fables.json')
  // Decode Aesop's fables from JSON
  .then(response => response.json())
  .then(corpus => {
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
  })
  // Play with the histogram
  .then(() => {
    console.log(`Number of distinct tokens: ${histogram.size}`);
    for (const term of [
      'fox',
      'lion',
      'hare',
      'said',
      'went',
      'came',
      'and',
      'but',
      'then',
      'so',
      'because',
      'crab',
      'peackcock',
      'ploughman',
      'quiver',
      'oracle',
      'vkcxjhbvkjclxbhj',
    ]) {
      // Not necessarily needed, but adds consistency
      const token = tokenize(normalize(term))[0] || null;
      if (!token) {
        continue;
      }

      console.log(`Token: ${token}; Ocurrences: ${histogram.get(token) || 0}`);
    }
  })
  .then(() => {
    const sortedTokens = Array
      .from(histogram.entries())
      .sort((a, b) => b[1] - a[1])
      .map(entry => `${entry[0]}: ${entry[1]} `);
    
    console.log('Most common entries: \n', sortedTokens.slice(0, 100).join('\t'));
    console.log('Least common entries: \n', sortedTokens.slice(-101, -1).join('\t'));
  })
  .catch(e => console.log(e.message));

function normalize(string) {
  return string
    .normalize('NFKC')                       // Normalization form, compatibility decomposition followed by canonical composition
    .normalize('NFD')                        // Normalization form, canonical decomposition
    .replace(/(\p{M}|\p{Emoji_Modifier}|\p{P}\p{Sc}\p{Join_Control})/gu, '')  // Remove: marks / diacritics, emoji modifiers, punctuation
    .replace(/(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu, ' $1 ')  // put spaces around emojis so we treat them as words
    .replace(/\p{White_Space}/gu, ' ')       // transform whitespace to spaces
    .replace(/(\p{Ll})(\p{Lu})/gu, '$1 $2')  // split camelCase
    .replace(/(\p{N})(\p{L})/gu, '$1 $2')    // split number followed by word without space
    .replace(/(\p{L})(\p{N})/gu, '$1 $2')    // split word followed by number without space
    // Replace special characters with spaces
    .replace(/(\.|\\|\+|\*|\?|\[|\]|\^|\$|\(|\)|\{|\}|\=|\!|\<|\>|\||\:|\-|\/|,|_|#|`|'|"|~|@|%|&)/g, ' ')
    .replace(/\s+/gu, ' ')                   // remove extra whitespace between
    .toLowerCase();                          // make all text lowercase
}

function tokenize(string) {
  return string
    .split(' ')
    .filter(str => str && str.length > 0);
}
