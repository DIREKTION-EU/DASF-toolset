export const messages = {
  HOME: {
    TITLE: 'home',
    ROUTE: '/home',
    PAGE: 'Welcome to Mithril App',
    INTRO: 'A powerful single-page application framework built with Mithril.js and TypeScript',
    SECTION1_TITLE: 'Features',
    SECTION1:
      'This application demonstrates modern web development with Mithril.js, featuring reactive state management, internationalization support, and a modular component architecture.',
    SECTION2_TITLE: 'Technology Stack',
    SECTION2:
      'Built with TypeScript for type safety, Rspack for fast builds, and Materialize CSS for a responsive user interface. The Meiosis pattern ensures predictable state transitions.',
    SECTION3_TITLE: 'Usage',
    SECTION3:
      'Navigate through the sections using the navigation bar. Use the search function to find content across all pages. Switch languages to experience the internationalization features.',
  },
  ABOUT: {
    TITLE: 'About the app',
    ROUTE: '/about',
    PAGE: 'About Mithril App',
    INTRO: 'Learn more about this Mithril.js application and its development',
    SECTION1_TITLE: 'What is Mithril.js',
    SECTION1:
      'Mithril is a modern client-side JavaScript framework for building powerful single-page applications. It offers a compact API, virtual DOM implementation, and routing out of the box.',
    SECTION2_TITLE: 'Key Features',
    SECTION2:
      'This application demonstrates Mithril capabilities including reactive state management, internationalization, type-safe TypeScript development, and modular component architecture.',
    SECTION3_TITLE: 'Development Goals',
    SECTION3:
      'The goal of this project is to provide a clean, maintainable codebase that showcases modern web development patterns with Mithril.js as an alternative to heavier frameworks.',
  },
  SETTINGS: {
    TITLE: 'Settings',
    ROUTE: '/settings',
    PAGE: 'Application Settings',
    INTRO: 'Configure your application preferences and language settings',
    SECTION1_TITLE: 'Language Preferences',
    SECTION1:
      'Switch between English and Dutch. Your preference is saved to localStorage and persists across sessions.',
    SECTION2_TITLE: 'Theme Settings',
    SECTION2:
      'Customize the visual appearance of the application. Adjust colors, fonts, and layout preferences to match your workflow.',
    SECTION3_TITLE: 'Preferences',
    SECTION3:
      'Manage application behavior including default views, data persistence options, and notification settings.',
  },
  LANDING: { TITLE: 'Introduction', ROUTE: '/' },
  USER: 'User',
  EDITOR: 'Editor',
  ADMIN: 'Administrator',
  CANCEL: 'Cancel',
  DELETE: 'Delete',
  YES: 'Yes',
  NO: 'No',
  OK: 'Ok',
  NAME: 'Name',
  DESCRIPTION: 'Description',
  DELETE_ITEM: {
    TITLE: 'Delete {item}',
    DESCRIPTION: 'Are you certain you want to delete this {item}. There is no turning back?',
  },
  SAVE_BUTTON: {
    LABEL: 'Save',
    TOOLTIP: 'Save unsaved changes',
  },
  SEARCH: 'Search...',
  SEARCH_TOOLTIP: 'Type / to search',
  LANGUAGE: 'Language',
  CLEAR: 'Clear model',
  UPLOAD: 'Upload model as JSON',
  DOWNLOAD: 'Download model as JSON',
  PERMALINK: 'Create permanent link',
  ROLE: 'Role',
  LINK: 'Link',
  MODEL: 'Model',
  TITLE: 'Title',
  AUTHORS: 'Authors',
  TYPE: 'Type',
  HITS: {
    n: '{n} Hits',
  },
  NO_RESULTS: 'No results found',
  CLEAR_SEARCH: 'Clear search',
  PAGE_NOT_FOUND: 'Page Not Found',
};

export type Messages = typeof messages;
