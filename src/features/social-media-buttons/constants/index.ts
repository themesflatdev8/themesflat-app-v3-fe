export const _settingsDefault = {
  visibility: false,
  socials: [
    { id: "facebook", label: "Facebook", link: "" },
    { id: "instagram", label: "Instagram", link: "" },
    { id: "tiktok", label: "Tiktok", link: "" },
    { id: "youtube", label: "Youtube", link: "" },
    { id: "x", label: "X", link: "" },
    { id: "linkedin", label: "Linkedin", link: "" },
    { id: "discord", label: "Discord", link: "" },
    { id: "snapchat", label: "Snapchat", link: "" },
    { id: "pinterest", label: "Pinterest", link: "" },
    { id: "tumblr", label: "Tumblr", link: "" },
  ],
  desktop: {
    visibility: true,
    template: "circle", // square
    size: 40,
    position: "bottom_right", // bottom_left
    positionBottom: 20,
    positionLeft: 20,
    positionRight: 20,
    style: "vertical" // horizontal
  },
  mobile: {
    visibility: true,
    template: "circle", // square
    size: 32,
    position: "bottom_right", // bottom_left
    positionBottom: 20,
    positionLeft: 20,
    positionRight: 20,
    style: "vertical" // horizontal
  }
}