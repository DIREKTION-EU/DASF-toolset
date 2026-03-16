import { LANGUAGE } from '../utils';
import { i18n } from '../services';
import type { Settings as SharedSettings } from '@dasf-toolset/shared';

export type Settings = SharedSettings;

export const setLanguage = async (locale = i18n.currentLocale) => {
  localStorage.setItem(LANGUAGE, locale);
  await i18n.loadAndSetLocale(locale);
};
