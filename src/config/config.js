import {
  faDog,
  faWalking,
  faHome,
  faCut,
  faSearch
} from "@fortawesome/free-solid-svg-icons";

import { faFacebookF } from "@fortawesome/free-brands-svg-icons";

export const PROFESSIONALS_DB_URL =
  process.env.REACT_APP_PROFESSIONALS_DB_URL || "http://localhost:5000";

export const PROFESSIONALS_DB_TYPES = {
  trainers: { label: "אימון כלבים", icon: faDog },
  walkers: { label: "הולכת כלבים", icon: faWalking },
  sitters: { label: "פנסיון ודוג סיטינג", icon: faHome },
  groomers: { label: "טיפוח כלבים", icon: faCut }
};
export const PROFESSIONALS_DB_COLUMNS = [
  "id",
  "name",
  "facebookPage",
  "phone",
  "web",
  "email",
  "cities",
  "services"
];
export const PROFESSIONALS_DB_CACHE_VALIDITY = 5 * 60; // 5 minutes
export const PROFESSIONALS_CITY_LIST = {
  "Tel Aviv": { position: [32.06, 34.77], label: "תל אביב" },
  HaShfela: { position: [31.9, 34.88], label: "השפלה" },
  Jerusalem: { position: [31.76, 35.2], label: "ירושלים" },
  Haifa: { position: [32.8, 34.98], label: "חיפה" },
  "Rishon Lezion": { position: [31.9, 34.8], label: "ראשון לציון" },
  "Beer Sheva": { position: [31.25, 34.8], label: "באר שבע" },
  "Gush Dan": { position: [32.01, 34.8], label: "גוש דן" },
  Ashdod: { position: [31.8, 34.65], label: "אשדוד" },
  Ashkelon: { position: [31.65, 34.56], label: "אשקלון" }
};
export const NAVIGATION_LINKS = [
  {
    url: "/",
    text: "דף ראשי",
    icon: faHome
  },
  {
    url: "/professionals",
    text: "אינדקס אנשי מקצוע",
    icon: faSearch
  },
  {
    url: "https://www.facebook.com/groups/476196172437302/",
    text: "הקבוצה בפייסבוק",
    icon: faFacebookF,
    external: true
  },
  {
    url: "https://www.facebook.com/groups/470596276647495/",
    text: "קבוצת הגורים בפייסבוק",
    icon: faFacebookF,
    external: true
  }
];
