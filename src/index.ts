import type { Resource } from 'i18next';
import i18next, { i18n as I18nInstance } from 'i18next';

import en from './languages/en';

interface I18nConfig {
  defaultLanguage: string;
  resources: Resource;
}

const DEFAULT_CONFIG: I18nConfig = {
  defaultLanguage: 'en',
  resources: {
    en,
  },
};

class I18nService {
  private static instance: I18nService;
  private readonly i18n: I18nInstance;
  private initialized: boolean = false;

  private constructor() {
    this.i18n = i18next;
  }

  public static getInstance(): I18nService {
    if (!I18nService.instance) {
      I18nService.instance = new I18nService();
    }
    return I18nService.instance;
  }

  public async initialize(config: Partial<I18nConfig> = {}): Promise<I18nInstance> {
    if (this.initialized) {
      return this.i18n;
    }

    try {
      const mergedConfig = {
        ...DEFAULT_CONFIG,
        ...config,
      };

      await this.i18n.init({
        lng: mergedConfig.defaultLanguage,
        resources: mergedConfig.resources,
        interpolation: {
          escapeValue: false,
        },
        fallbackLng: mergedConfig.defaultLanguage,
      });

      this.initialized = true;
      return this.i18n;
    } catch (error) {
      console.error('Failed to initialize i18n:', error);
      throw new Error('I18n initialization failed');
    }
  }

  public getI18n(): I18nInstance {
    if (!this.initialized) {
      throw new Error('I18n service not initialized. Call initialize() first.');
    }
    return this.i18n;
  }

  public t(...args: Parameters<typeof i18next.t>): ReturnType<typeof i18next.t> {
    return this.i18n.t(...args);
  }
}

export const i18nService = I18nService.getInstance();
export const t = (...args: Parameters<typeof i18next.t>) => i18nService.t(...args);
export const initialize = (config?: Partial<I18nConfig>) => i18nService.initialize(config);