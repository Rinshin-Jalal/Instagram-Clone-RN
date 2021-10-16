import { USERS } from "./users";

export const POSTS = [
  {
    imageUrl:
      "https://instagram.fcok10-1.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/242628546_721202572608354_6336810203574874580_n.jpg?_nc_ht=instagram.fcok10-1.fna.fbcdn.net&_nc_cat=106&_nc_ohc=aCJ-qJlL_scAX_TSi6e&edm=AP_V10EBAAAA&ccb=7-4&oh=59a6fddab1e720daab7fc630d0fcea48&oe=616A0B09&_nc_sid=4f375e",
    user: USERS[0].user,
    likes: 34685,
    caption: "Me and my Garfield 😁",
    profile_picture: USERS[0].image,
    comments: [
      { user: "rinzhin_net", comment: "WOW" },
      { user: "murad_abdul_rahoof", comment: "meow" },
    ],
  },
  {
    imageUrl:
      "https://instagram.fcok13-1.fna.fbcdn.net/v/t51.2885-15/e35/s1080x1080/244868161_382943873323924_737875052287992411_n.jpg?_nc_ht=instagram.fcok13-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=cKTkwWAVD7YAX8yJW19&edm=AAeKFY8BAAAA&ccb=7-4&oh=5825c00d4c9b340283bef172028edd7e&oe=616C12A4&_nc_sid=c982ba",
    user: USERS[2].user,
    likes: 34685,
    caption:
      "Photo by @gabrielegalimbertiphoto / A fishing boat sails among icebergs in Ilulissat Icefjord, on the west coast of Greenland.",
    profile_picture: USERS[2].image,
    comments: [
      { user: "rinzhin_net", comment: "WOW , This is an amazing picture man" },
      {
        user: "murad_abdul_rahoof",
        comment: "Great, I like to visit there.where is this place .",
      },
    ],
  },
];
