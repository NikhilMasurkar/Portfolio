/**
 * Case-study prose, written from the actual repositories in ~/Documents.
 *
 * Every claim here traces to something real: a dependency in a package.json, a
 * folder of screens, a route file. Nothing is inferred from the project name.
 * The numbers are the ones already on the resume and therefore already
 * checkable — no new ones were invented to fill a section.
 *
 * Written to be read by a person, not scanned by a keyword filter. Short
 * sentences, plain words, and the trade-offs left in. A case study that only
 * lists wins is the kind nobody believes.
 *
 * Sections are optional and an empty one renders nothing, so where there was
 * no real evidence the section is simply absent rather than padded.
 *
 * ForumUI is missing on purpose — it is the one project with no repository in
 * ~/Documents, and guessing at it would undo the point of the exercise.
 */

export const caseStudies = {
  "indigolearn-app": {
    overview:
      "1FIN is the app CA, CMA and ACCA students use to study. Video lectures, practice questions, discussion forums, a study planner, attendance — the whole thing lives in one React Native app that runs on Android and iOS.\n\nI worked on it for three and a half years, starting as a fresher and ending up owning the frontend.",

    problem:
      "Students don't study at a desk on good wifi. They study on trains, in hostels with shared connections, and on mobile data they are trying not to burn through. Streaming a two-hour lecture in those conditions is miserable.\n\nThere was also a harder constraint. The lectures are the product. If someone can screen-record a course and pass the file around, the business stops working. So the video had to be downloadable for offline use and protected at the same time — two requirements that pull in opposite directions.",

    role:
      "I owned the app's frontend. Features, releases, and whatever broke in production.\n\nThat included the parts nobody sees: chasing crashes from Crashlytics reports, keeping the app working across React Native upgrades, and getting builds through Google Play and App Store review. I also mentored three junior developers on the team.",

    architecture:
      "React Native with Redux for state, and redux-persist so the app opens with something on screen instead of a spinner.\n\nVideo goes through VdoCipher, which handles the DRM. That was the piece that made offline downloads possible at all — the file on the device is encrypted and only their player can decrypt it, so a download is not a copy anyone can share.\n\nPayments are Razorpay. Push notifications, analytics, crash reporting and performance traces all come from Firebase. NetInfo drives the offline states, so the app tells you it has lost connection rather than just failing quietly.\n\nThe feature areas ended up as separate modules — LMS, MCQ, forums, attendance, leave tracker, live class schedule, free resources, points — which kept them from tangling into each other.",

    decisions:
      "The reusable component library was the decision that paid off most. Fifty-odd components, built once and used everywhere. It cut roughly 30% off the time to ship a new feature, mostly because nobody had to argue about what a button should look like any more.\n\nUsing a third-party DRM service instead of building protection ourselves was the other one. It costs money per stream and ties the app to their SDK. Building it in-house would have been cheaper on paper and would have taken months to get right — and getting DRM slightly wrong means the lectures leak.",

    results:
      "Over 100,000 downloads across Android and iOS, around 15,000 active users, a 4.3+ rating on the Play Store, and a 99.8% crash-free rate.\n\nThe crash-free number is the one I care about most. It is the difference between an app people trust with their exam prep and one they stop opening.",

    lessons:
      "Most of what went wrong was never a feature. It was a dependency upgrade, a platform requirement changing, or a device behaving differently to every other device.\n\nThe other lesson was about releases. I used to treat shipping as the end of the work. It is closer to the middle — the store review, the staged rollout, and watching the crash graph afterwards are all part of it.",
  },

  "mezorder-pos": {
    overview:
      "MezOrder is a point-of-sale system for restaurants. Customers scan a QR code at the table and order from their phone, staff manage everything from a dashboard, and the kitchen gets the tickets on a screen.\n\nIt is four separate applications sharing one backend: the customer menu, the business dashboard, a super-admin console, and the marketing site.",

    problem:
      "Small restaurants get quoted a lot for POS software, and most of it assumes a chain with an IT person. They need something they can set up themselves in an afternoon, that works on the phone they already own, and that produces a GST bill the tax office will accept.\n\nThe billing part is not optional in India. Get the CGST and SGST split wrong and you have handed your customer an invalid invoice.",

    role:
      "I built it. All four apps, the database schema, and the deployment.",

    architecture:
      "Four Next.js applications on a shared Supabase backend. Splitting them up was the point — a customer scanning a QR code should not download the admin dashboard, and the marketing site should not be coupled to either.\n\nSupabase handles auth and the database, with row-level security doing the multi-tenant separation so one restaurant can never read another's orders. Server Actions handle the writes, which keeps the database logic on the server instead of shipping it to the browser.\n\nThe dashboard covers orders, tables across multiple floors, the menu editor, the kitchen display, bills, settings and onboarding. Drag and drop for arranging menus and tables uses dnd-kit. Images uploaded by restaurant staff get compressed in the browser before they are sent, because a photo straight off a phone is several megabytes and nobody wants to wait for that on a café's wifi.",

    decisions:
      "Building four apps instead of one was more setup work and I would do it again. The customer-facing menu has to load fast on a phone with one bar of signal, and bundling it with a dashboard nobody at the table will ever open would have made that impossible.\n\nGenerating bills with pdf-lib in the browser rather than on a server was the pragmatic call. It means no server round trip and no PDF service to pay for, and a bill is a small enough document that the browser handles it fine.",

    lessons:
      "Multi-tenant data is something to get right on day one. Retrofitting row-level security onto a schema that assumed one customer is painful, and the failure mode — one restaurant seeing another's orders — is the kind you cannot apologise your way out of.",
  },

  "acc-website": {
    overview:
      "Avinash College of Commerce ran on WordPress. I rebuilt it as a server-rendered React application — 36 routes covering courses, admissions, branches, placements, student life and a blog.",

    problem:
      "The site's whole job is to be found. A parent searching for a commerce college in Hyderabad needs to land on it, and a link shared on WhatsApp needs to show a real title and image rather than a blank preview.\n\nThat rules out a normal single-page React app. Crawlers and the WhatsApp link previewer do not run JavaScript, so a client-rendered site is an empty page to both.",

    role:
      "I did the rebuild — the SSR setup, the pages, and the deployment to AWS ECS.",

    architecture:
      "React 19 and Vite, with a custom Express server doing the rendering. Every request renders the page to real HTML, so the response already has the content and the right meta tags in it.\n\nThe blog is generated at build time. Posts are JSON files, and a build script turns them into the route map, the listing feed and the sitemap. Drop in a file, run a build, and it is wired into everything.\n\nIt runs in Docker on AWS ECS.",

    decisions:
      "The bit I would tell anyone doing this: the SSR server has a fallback that serves the plain app shell if rendering throws. That sounds sensible and it is genuinely dangerous, because the site then looks completely fine in a browser while every crawler gets an empty page. You will not notice.\n\nSo the build has a verify script that checks the real thing — that pages return HTML with content in it, that unknown URLs return 404 rather than a soft 200, and that the sitemap only lists pages that exist. It has caught real problems, including four blog posts that were live and invisible to Google at the same time.",

    lessons:
      "SEO problems do not announce themselves. Everything looks right in the browser, and the only way to know is to check what a crawler actually receives. That check has to be automated, because nobody remembers to run it by hand.",
  },

  "nucleus-admin": {
    overview:
      "Nucleus is the admin platform behind 1FIN. Everything the students never see — courses, sales, leads, transactions, faculty, marketing, reporting — is run from here.\n\nIt is a large React application. Around 177 routes and 368 modals.",

    problem:
      "It grew fast, the way internal tools do. Something gets added every time a team needs it, and after a few years there are dozens of sections that all look slightly different and none of them work properly on a laptop screen, let alone a phone.\n\nStaff were using it every day. Nobody had time for a rewrite.",

    role:
      "I modernised it. Rebuilt the theme system, made the whole thing responsive, and did it in 15 working days without taking it offline.",

    architecture:
      "React with Ant Design. The scale is the interesting part — sections for courses, ecommerce, leads, sales, transactions, reports, surveys, forums, marketing, study planner and more.\n\nParts of it use server-sent events, so screens that need to stay current update on their own rather than making someone press refresh.",

    decisions:
      "Rebuilding the theme rather than restyling screens one at a time. With 177 routes, page-by-page was never going to finish — and half-done is worse than not started, because then the app has two designs in it.\n\nCentralising it meant one change moved everything at once. It also meant a mistake moved everything at once, which is the trade.",

    lessons:
      "On something this size, the win is finding the one place a change propagates from. The temptation is to start fixing the screen in front of you, and that is how three months disappear.",
  },

  "indigolearn-web": {
    overview:
      "The IndigoLearn website — the public side of the same platform the app serves. Course listings for CA, CMA and ACCA, free resources, and the purchase flow.",

    problem:
      "It was a Create React App build that had got slow to work on. Cold starts took a while, the build was sluggish, and like the college site it needed to be server-rendered to be findable at all.",

    role:
      "I moved it to Vite and set up server-side rendering.",

    architecture:
      "Vite with an Express SSR entry point. Redux Toolkit for state, MUI for the interface, react-final-form for the forms.\n\nPayments go through Cashfree. Video uses VdoCipher and react-player, the same protection the app uses, so a lecture is not unprotected just because someone watched it in a browser.",

    decisions:
      "Migrating rather than rewriting. The application logic was fine — it was the build tooling that had become the problem. Rewriting would have meant re-testing a purchase flow that already worked, for no benefit to anyone using it.",

    lessons:
      "A slow build is not just annoying. It changes how you work: you batch up changes, you check things less often, and you find problems later than you should.",
  },

  budgetiq: {
    overview:
      "A personal finance dashboard that uses Google Sheets as its database. You connect your own sheet, and it turns it into charts and trends.",

    problem:
      "Most budgeting apps want you to hand over your bank login. A lot of people are not comfortable with that, and plenty already track their spending in a spreadsheet — they just cannot see anything useful in it.",

    role: "A side project. I built all of it.",

    architecture:
      "React and Vite, with MUI for the interface and Chart.js for the graphs. Google Sheets is the database, reached through OAuth 2.0 so the app only ever touches the one sheet the user picks.\n\nThere is also a custom Excel parser for importing statements, since bank exports are all shaped differently and none of them match what the sheet expects.",

    decisions:
      "Using a spreadsheet as the database sounds like a shortcut and it was the actual feature. The data stays in the user's own Google account, they can open it and edit it directly, and there is no server holding anyone's financial history — which is also nothing for me to secure or be responsible for.",

    lessons:
      "Bank statement exports are far messier than you expect. Every bank has its own column order, its own date format, and its own idea of what a negative number looks like.",
  },

  "the-sky-events": {
    overview:
      "A website for an event management company — services, past work, and a way to get in touch.",

    problem:
      "They had no real web presence. People asking about weddings and corporate events were finding them through word of mouth and had nowhere to look them up afterwards.",

    role: "Design and build, working from what they wanted to show.",

    architecture:
      "React and TypeScript on Vite, with shadcn/ui and Tailwind. Forms use react-hook-form with Zod validation, and enquiries are sent through EmailJS.",

    decisions:
      "EmailJS instead of a backend. The site has one form on it. Standing up a server, hosting it and maintaining it so that a contact form works would have been more moving parts than the whole site justified.",

    lessons:
      "For a small brochure site, the right amount of infrastructure is usually less than you think. The temptation is to build the version that would scale, for something that will never need to.",
  },
};
