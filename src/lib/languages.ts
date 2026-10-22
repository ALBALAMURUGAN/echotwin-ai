export type Lang = {
  code: string; // translation code
  locale: string; // speech locale
  name: string;
  native: string;
  tag: string;
};

export const LANGUAGES: Lang[] = [
  { code: 'en', locale: 'en-US', name: 'English', native: 'English', tag: 'EN' },
  { code: 'ta', locale: 'ta-IN', name: 'Tamil', native: 'தமிழ்', tag: 'TA' },
  { code: 'hi', locale: 'hi-IN', name: 'Hindi', native: 'हिन्दी', tag: 'HI' },
  { code: 'te', locale: 'te-IN', name: 'Telugu', native: 'తెలుగు', tag: 'TE' },
  { code: 'ml', locale: 'ml-IN', name: 'Malayalam', native: 'മലയാളം', tag: 'ML' },
  { code: 'kn', locale: 'kn-IN', name: 'Kannada', native: 'ಕನ್ನಡ', tag: 'KN' },
  { code: 'bn', locale: 'bn-IN', name: 'Bengali', native: 'বাংলা', tag: 'BN' },
  { code: 'mr', locale: 'mr-IN', name: 'Marathi', native: 'मराठी', tag: 'MR' },
  { code: 'gu', locale: 'gu-IN', name: 'Gujarati', native: 'ગુજરાતી', tag: 'GU' },
  { code: 'ur', locale: 'ur-PK', name: 'Urdu', native: 'اردو', tag: 'UR' },
  { code: 'es', locale: 'es-ES', name: 'Spanish', native: 'Español', tag: 'ES' },
  { code: 'fr', locale: 'fr-FR', name: 'French', native: 'Français', tag: 'FR' },
  { code: 'de', locale: 'de-DE', name: 'German', native: 'Deutsch', tag: 'DE' },
  { code: 'it', locale: 'it-IT', name: 'Italian', native: 'Italiano', tag: 'IT' },
  { code: 'pt', locale: 'pt-BR', name: 'Portuguese', native: 'Português', tag: 'PT' },
  { code: 'ru', locale: 'ru-RU', name: 'Russian', native: 'Русский', tag: 'RU' },
  { code: 'ar', locale: 'ar-SA', name: 'Arabic', native: 'العربية', tag: 'AR' },
  { code: 'ja', locale: 'ja-JP', name: 'Japanese', native: '日本語', tag: 'JA' },
  { code: 'ko', locale: 'ko-KR', name: 'Korean', native: '한국어', tag: 'KO' },
  { code: 'zh-CN', locale: 'zh-CN', name: 'Chinese', native: '中文', tag: 'ZH' },
];

export const getLang = (code: string): Lang => LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
