/**
 * EmailJS, carried over from the previous portfolio so the contact form keeps
 * landing in the same inbox with the same template.
 *
 * THESE THREE IDS ARE PUBLIC BY DESIGN. EmailJS sends from the browser, so all
 * three ship in the client bundle no matter where they are written — that is
 * how the service works, and why the third one is called a *public* key. There
 * is no version of this that hides them.
 *
 * What actually stops someone else sending through the account is the domain
 * allowlist: EmailJS dashboard → Account → Security → allowed origins. Set it
 * to the live domain. Without that, these ids are enough for anyone who views
 * source to use the quota.
 *
 * TEMPLATE_PARAMS must match the variable names inside template_h7t3s9v. They
 * are not free-form: a renamed key does not error, it delivers an email with
 * an empty body.
 */
export const EMAILJS_CONFIG = {
  serviceId: "service_i9q3i8c",
  templateId: "template_h7t3s9v",
  publicKey: "9a2-y4VYOwks74iPx",
  endpoint: "https://api.emailjs.com/api/v1.0/email/send",
};
