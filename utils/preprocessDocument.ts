// Import necessary modules
import natural from "natural";
import { removeStopwords } from "stopword";

interface PreprocessDocument {
  (text: string): string;
}

const tokenizer = new natural.WordTokenizer();

// Define preprocess_text function
export const preprocessDocument: PreprocessDocument = (
  text: string
): string => {
  // Convert text to lowercase
  text = text.toLocaleLowerCase();

  // Remove special characters
  text = text.replace(/[^a-zA-Z0-9\s]/g, " ");

  // Tokenize text
  const tokens: string[] = tokenizer.tokenize(text);

  // Remove stop words
  const filteredTokens: string[] = removeStopwords(tokens);

  // Stemmed words
  const stemmedTokens: string[] = filteredTokens.map((word: string) =>
    natural.PorterStemmer.stem(word)
  );

  // Join stemmed tokens
  return stemmedTokens.join(" ");
};
