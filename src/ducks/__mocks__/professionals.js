export const MOCK_SIMPLE_TRAINERS = {
  csv: `id,name,facebookPage,phone,web,email,tags
1,t1,fb.com,111,www,a@b.com,a,b,c`,
  json: [
    {
      type: 0,
      id: "1",
      name: "t1",
      facebookPage: "fb.com",
      phone: "111",
      web: "www",
      email: "a@b.com",
      tags: ["a", "b", "c"]
    }
  ]
};
