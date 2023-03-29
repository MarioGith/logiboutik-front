module.exports = {
  i18n: {
    defaultLocale: "fr",
    locales: ["fr"],
  },
  localePath:
    typeof window === "undefined"
      ? require("path").resolve("./public/locales")
      : "/locales",
};
