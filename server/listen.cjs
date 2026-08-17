/**
 * Local runner: `npm run ssr`.
 *
 * Deliberately outside the bundle and deliberately .cjs — package.json sets
 * "type": "module", so a .js file here would be ESM and could not `require`
 * the CommonJS bundle Vite emits. Production does not use this file; Netlify
 * wraps the same exported app in netlify/functions/ssr.js.
 */
// Rollup collapses a lone `export default` to `module.exports = app`, but
// switches to `exports.default` the moment server/index.js gains a named
// export. Unwrap both shapes so that change cannot break the server.
const bundle = require("../build-server/index.cjs");
const app = bundle.default || bundle;

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on ${port}`));
