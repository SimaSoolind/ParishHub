// i18n — konfiguration för flerspråkighet (svenska + arabiska)
// Startar i18next med react-i18next och laddar översättningarna
// Importeras en gång i main.tsx
//
// Svenska är standard, arabiska är tillval, svenska används som reserv

import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import sv from "./locales/sv"
import ar from "./locales/ar"

i18n.use(initReactI18next).init({
  resources: {
    sv: { translation: sv },
    ar: { translation: ar },
  },
  lng: "sv",         // standardspråk
  fallbackLng: "sv", // används om en nyckel saknas i valt språk
  interpolation: {
    escapeValue: false, // React skyddar redan mot XSS
  },
})

export default i18n
