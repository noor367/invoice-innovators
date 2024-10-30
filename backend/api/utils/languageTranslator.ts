const translate = require('translate-google');

/**
 * Translation helper function
 *
 * @param { string } text
 * @param { string } languageName
 * @returns { string }
 */
async function translateToLanguage(text: string, languageName: string): Promise<string> {
  // ISO 639 language codes
  const languageCode = languageNameToCode(languageName);
  try {
    const res = await translate(text, { to: languageCode });
    return res;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to translate text');
  }
}

/**
 * Helper function for turn language into its ISO 639 language codes
 *
 * @param { string } name
 * @returns { string }
 */
function languageNameToCode(name: string): string {
  const map = {
    english: 'en',
    spanish: 'es',
    french: 'fr',
    german: 'de',
    vietnamese: 'vi',
    chinese: 'zh',
    japanese: 'ja',
    arabic: 'ar',
    hindi: 'hi',
    italian: 'it'
    // more language is coming
  };
  return map[name.toLowerCase()] || 'en'; // Default to English if not found
}

module.exports = { translateToLanguage };
