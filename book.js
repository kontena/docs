module.exports = {
  title: "Kontena",
  plugins: [
    "edit-link", "prism", "-highlight", "github", "anchorjs",
    "ga", "scripts", "mixpanel"
  ],
  pluginsConfig: {
    "edit-link": {
      base: "https://github.com/kontena/docs/tree/master",
      label: "Edit This Page"
    },
    github: {
      url: "https://github.com/kontena/docs/"
    },
    ga: {
      token: process.env.GA_CODE || ""
    },
    scripts: {
      files: [
        "./_scripts/hs.js",
        "./_scripts/menu.js"
      ]
    },
    hs: {
      code: process.env.HUBSPOT_CODE || ""
    },
    mixpanel: {
      token: process.env.MIXPANEL_TOKEN || ""
    }
  },
  styles: {
    website: "_styles/website.css"
  },
  variables: {
  }
};
