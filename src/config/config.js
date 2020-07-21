import {
  faDog,
  faWalking,
  faHome,
  faCut,
  faNewspaper,
  faPaw,
  faStar,
  faSearchLocation,
  faClinicMedical,
  faStore,
  faFutbol,
  faCamera,
  faCameraRetro,
  faDiagnoses,
  faHandHoldingHeart,
  faHandHoldingMedical,
  faBriefcaseMedical,
  faStoreAlt,
  faShoppingCart
} from "@fortawesome/free-solid-svg-icons";

import { faFacebookF } from "@fortawesome/free-brands-svg-icons";

export const PROFESSIONALS_DB_URL =
  process.env.REACT_APP_PROFESSIONALS_DB_URL || "http://localhost:5000";

export const PROFESSIONALS_DB_TYPES = {
  trainers: { label: "אימון כלבים", icon: faDog, default: true },
  walkers: { label: "הולכת כלבים", icon: faWalking, default: true },
  sitters: { label: "פנסיון ודוג סיטינג", icon: faHome, default: true },
  groomers: { label: "טיפוח כלבים", icon: faCut },
  veterinarians: { label: "וטרינריה", icon: faBriefcaseMedical },
  Shops: { label: "חנויות", icon: faShoppingCart },
  Agility: { label: "ספורט כלבני", icon: faFutbol },
  Photography: { label: "צילום", icon: faCameraRetro },
  "complementary medicine": {
    label: "רפואה משלימה",
    icon: faHandHoldingMedical
  }
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
  "Ramat-Gan-Givataim": {
    position: [32.068424, 34.824783],
    label: "רמת גן וגבעתיים"
  },
  Ashdod: { position: [31.8, 34.65], label: "אשדוד" },
  Ashkelon: { position: [31.65, 34.56], label: "אשקלון" },
  Galil: { position: [32.964315, 35.342757], label: "הגליל" },
  "Emek Hefer": { position: [32.40365, 34.90017], label: "עמק חפר" },
  "Yehuda and Shomron": {
    position: [31.946569, 35.302723],
    label: "יהודה ושומרון"
  },
  "North Sharon": { position: [32.299612, 34.944739], label: "צפון השרון" },
  "South Sharon": { position: [32.157884, 34.896643], label: "דרום השרון" },
  "Petah Tikva": { position: [32.087083, 34.878778], label: "פתח תקווה" },
  "Holon Bat-Yam": { position: [32.01841, 34.763346], label: "חולון ובת-ים" },
  "Gazza Area": { position: [31.495286, 34.548286], label: "עוטף עזה" },
  Arad: { position: [31.260797, 35.212902], label: "ערד" },
  Negev: { position: [30.819115, 34.841518], label: "הנגב" },
  Eilat: { position: [29.556436, 34.949489], label: "אילת" }
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
    icon: faSearchLocation
  },
  {
    url: "/articles",
    text: "מאמרים",
    icon: faNewspaper,
    highlighted: true
  },
  {
    url: "/position-statements",
    text: "עקרונות הגישה",
    icon: faStar,
    highlighted: true
  },
  {
    url: "/about",
    text: "על הקבוצה",
    icon: faPaw,
    highlighted: true
  },
  {
    url: "https://www.facebook.com/groups/476196172437302/",
    text: "הקבוצה בפייסבוק",
    icon: faFacebookF,
    external: true,
    logo: true,
    highlighted: true
  },
  {
    url: "https://www.facebook.com/groups/470596276647495/",
    text: "קבוצת הגורים בפייסבוק",
    icon: faFacebookF,
    external: true
  }
];
