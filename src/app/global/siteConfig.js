import config from "../../../project.config.json";

/**
 * project.config.json, with the noise stripped and a trailing-slash-free
 * domain. Everything that needs the site's identity reads from here.
 */
export const SITE = {
  ...config,
  domain: config.domain.replace(/\/$/, ""),
};

export default SITE;
