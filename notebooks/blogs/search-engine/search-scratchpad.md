
## Thoughts scratchpad



English and most languages are quite wordy. We can remove a lot of the common words since they add little value to the context. But how do we know what value a word adds to the context? There are a few different methods that we can use:

* **TF-IDF (Term Frequency-Inverse Document Frequency)**: among the simplest of the ranking functions. Many of the more sophisticated ranking functions are variants of this.
* **BM25 (Okapi BM25)**: refined version of TF-IDF, which adds saturation and frequency normalization.
* **Word Embeddings (Word2vec, GloVe, FastText)**: capture semantics instead of just term frequency, but more expensive to compute
* **Entropy-Based Weighting**: measures how uniformly a word appears in documents. Words appearing across more documents are likely less important

There are many more methods, some even involving machine learning. However, for simplicity, we will use TF-IDF in this project, and may switch it out for a better method later on.
