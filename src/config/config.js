import {
  faDog,
  faWalking,
  faHome,
  faCut,
  faSearch
} from "@fortawesome/free-solid-svg-icons";

import { faFacebookF } from "@fortawesome/free-brands-svg-icons";

export const PROFESSIONALS_DB_URL =
  process.env.PROFESSIONALS_DB_URL || "http://localhost:5000";
export const PROFESSIONALS_DB_TYPES = {
  trainers: { label: "אימון כלבים", icon: faDog },
  walker: { label: "הולכת כלבים", icon: faWalking },
  sitter: { label: "פנסיון ודוג סיטינג", icon: faHome },
  groomer: { label: "טיפוח כלבים", icon: faCut }
};
export const PROFESSIONALS_DB_COLUMNS = [
  "id",
  "name",
  "facebookPage",
  "phone",
  "web",
  "email",
  "cities"
];
export const PROFESSIONALS_DB_CACHE_VALIDITY = 5 * 60; // 5 minutes
export const PROFESSIONALS_CITY_LIST = {
  "Tel Aviv": { position: [32.06, 34.77], label: "תל אביב" },
  HaShfela: { position: [31.9, 34.88], label: "השפלה" },
  Jerusalem: { position: [31.76, 35.2], label: "ירושלים" }
};
export const NAVIGATION_LINKS = [
  {
    url: "/",
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
