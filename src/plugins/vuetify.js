import Vuetify from 'vuetify/lib/framework'
import pt from 'vuetify/lib/locale/pt'
import colors from 'vuetify/lib/util/colors'

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: colors.indigo.darken4, // #1A237E
        secondary: '#669BBC',
        accent: '#3699FC',
        error: '#DF2935',
        info: '#0366C9',
        success: '#2CA58D',
        warning: '#FCA311',
        // white: '#FBF5F3'
      },
      dark: {
        primary: colors.indigo.darken4, // #1A237E
        secondary: '#669BBC',
        accent: '#3699FC',
        error: '#DF2935',
        info: '#0366C9',
        success: '#2CA58D',
        warning: '#FCA311',
      },
    },
  },
  lang: {
    locales: { pt },
    current: 'pt',
  },
})
