export const MOCK_PROFESSIONALS_DB_TYPES = {
  0: { label: "אימון כלבים" },
  1: { label: "הולכת כלבים" }
};

export const MOCK_SIMPLE_TRAINERS = {
  csv: `id,name,facebookPage,phone,web,email,cities
1,t1,fb.com,111,www,a@b.com,a,b,c`,
  json: [
    {
      type: "0",
      id: "1",
      name: "t1",
      facebookPage: "fb.com",
      phone: "111",
      web: "www",
      email: "a@b.com",
      cities: ["a", "b", "c"]
    }
  ]
};

export const MOCK_SIMPLE_DOGWALKERS = {
  csv: `id,name,facebookPage,phone,web,email,cities
1,dw1,fb.com,333,www,dogwalker1@b.com,a,b,c`,
  json: [
    {
      type: "1",
      id: "1",
      name: "dw1",
      facebookPage: "fb.com",
      phone: "333",
      web: "www",
      email: "dogwalker@b.com",
      cities: ["a", "b", "c"]
    }
  ]
};

export const MOCK_DIFFERENT_CITIES = {
  csv: `id,name,facebookPage,phone,web,email,cities
1,t1,fb.com,111,www,a@b.com,a,b,c
2,t2,fb.com,222,www,c@d.com,d,e,f`,
  json: [
    {
      type: "0",
      id: "1",
      name: "t1",
      facebookPage: "fb.com",
      phone: "111",
      web: "www",
      email: "a@b.com",
      cities: ["a", "b", "c"]
    },
    {
      type: "0",
      id: "2",
      name: "t2",
      facebookPage: "fb.com",
      phone: "222",
      web: "www",
      email: "c@d.com",
      cities: ["d", "e", "f"]
    }
  ]
};
