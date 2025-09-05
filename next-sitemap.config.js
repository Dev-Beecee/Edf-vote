/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://concoursvideo.edf-mq.fr",
  generateRobotsTxt: true,
  exclude: ["/ghost-dashboard", "/ghost-dashboard/*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/ghost-dashboard", "/ghost-dashboard/*"],
      },
    ],
  },
};
