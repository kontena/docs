module.exports = {
  title: "Kontena",
  plugins: [
    "edit-link", "prism", "-highlight", "github", "anchorjs",
    "ga", "scripts", "mikxpanel@git+https://github.com/kontena/gitbook-plugin-mikxpanel.git"
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
        "./_scripts/menu.js",
        "./_scripts/tracks.js"
      ]
    },
    hs: {
      code: process.env.HUBSPOT_CODE || ""
    },
    mikxpanel: {
      token: process.env.MIXPANEL_TOKEN || "",
      event_prefix: "docs.classic"
    }
  },
  styles: {
    website: "_styles/website.css"
  },
  variables: {
  }
};
