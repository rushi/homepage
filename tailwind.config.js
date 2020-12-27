const settings = {
  purge: {},
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    float: false
  }
}

if (process.env.NODE_ENV === 'production') {
  settings.purge = {
    enabled: true,
    preserveHtmlElements: false,
    content: ['./public/*.html']
  };
}

module.exports = settings;