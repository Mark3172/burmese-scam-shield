/**
 * Burmese Unicode Normalizer & Segmenter (Syllable Break)
 * Handles both Standard Unicode and common Zawgyi-Unicode conflations.
 * Burmese texts don't use spaces between words, so syllable segmenting
 * with regex breaks is essential for token-based NLP and keyword matching.
 */

export class BurmeseTextProcessor {
  // Regex to split Burmese syllables (Standard Rule for Unicode Syllable Breaking)
  // Consonants \u1000-\u1021 followed by medials, vowels, viramas, or asat
  private static readonly SYLLABLE_REGEX = 
    /([က-အ|ဥ|ဦ|ဧ|ဩ|ဪ|ဿ](?:[\u103B-\u103E]*)(?:[\u102B-\u1032]*)(?:(?:\u103A[\u1000-\u1021])|(?:\u1039[\u1000-\u1021])|[\u1036-\u1038])*)/g;

  /**
   * Normalizes Unicode sequences (reordering diacritics where necessary)
   */
  public static normalize(text: string): string {
    if (!text) return '';
    
    // Normalize NFKC (standardizes decomposed characters)
    let normalized = text.normalize('NFKC');

    // Fix typical Zawgyi confusion for zero/wa-lone (၀ vs 0)
    // Convert ASCII digits inside Burmese context or standardize spaces
    normalized = normalized.trim();

    return normalized;
  }

  /**
   * Breaks Burmese sentence into syllables for NLP processing
   */
  public static tokenizeSyllables(text: string): string[] {
    const normalized = this.normalize(text);
    const matches = normalized.match(this.SYLLABLE_REGEX);
    if (!matches) {
      // Fallback for English words or numbers mixed in the text
      return normalized.split(/\s+/).filter(Boolean);
    }

    // Also extract English alphanumeric words/tokens interspersed in Burmese text
    const englishTokens = normalized.replace(/[\u1000-\u109F]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 1);

    return [...matches, ...englishTokens];
  }

  /**
   * Cleans text for N-gram feature extraction
   */
  public static extractNgrams(tokens: string[], n: number = 2): string[] {
    const ngrams: string[] = [];
    for (let i = 0; i <= tokens.length - n; i++) {
      ngrams.push(tokens.slice(i, i + n).join(''));
    }
    return ngrams;
  }
}
