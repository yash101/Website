const input = '<résumé> #1 !+------ İSTANBUL ﬁancée 𝟙𝟚𝟛 ½ ¾ ¼ 👩‍🚀🏾🏳️‍🌈🚴🏽‍♂️✌🏿 search2023update multi-word—hyphenated excessive spaces FULLWIDTHＴＥＸＴ 𝒞𝒽𝑒𝓂𝒾𝒸𝒶𝓁 مَرْحَبًا 中文测试 💖✨Unicode✨💖 Hello👩‍💻World 2023年最新情報 परीक्षण προγραμματισμός доброе утро गणना123शब्द ';

console.log(input);
console.log(preprocess(input));

function preprocess(string) {
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
