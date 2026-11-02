# Mindpulseflow

Build MindPulse — A Whimsical, Pastel Wellness & Behavioural Tracking Web App

Act as a senior UI/UX designer and full-stack web developer. Build a polished, responsive web application called MindPulse, a personal wellness, behavioural tracking, focus and self-discovery platform designed primarily for students and young adults.

Do not create a generic SaaS dashboard, a corporate productivity tool, or a clinical mental-health website. MindPulse should feel like a small, comforting, cartoon-inspired digital world: warm, playful, peaceful, slightly magical, and delightful to interact with.

The visual experience is extremely important. However, the application must also have meaningful functionality, a clear information architecture, and a codebase that can be developed further.

1. Visual identity and art direction

Overall aesthetic: Cute editorial illustration meets modern pastel web design. Think rounded shapes, friendly cartoon details, soft textures, tiny decorative characters, organic blobs, floating stars, clouds, flowers and subtle hand-drawn accents.

The interface should feel thoughtfully designed, not childish. It should appeal to a college student who wants something adorable and calming without feeling like they are using a children's learning app.

Colour palette

Use a consistent, restrained pastel palette:

- Background: warm ivory "#FFF9F2"

- Primary pastel lavender: "#DCD5FF"

- Soft sage green: "#D8E9D5"

- Powder pink: "#F8DDE5"

- Butter yellow: "#FFF0B8"

- Pale sky blue: "#DCEEFF"

- Primary text: deep muted plum "#453C55"

- Secondary text: muted grey-lavender "#898398"

- White: "#FFFFFF"

Use warm ivory as the dominant background and distribute the other colours across cards, buttons, illustrations and accent elements. Avoid overly saturated colours, harsh black, excessive gradients and large areas of pure purple.

Maintain readable contrast, especially for text, interactive elements and form controls.

Shapes and components

- Use rounded cards with approximately 20–28px corner radii.

- Give cards subtle, soft shadows or delicate pastel borders.

- Use pill-shaped buttons and rounded input fields.

- Incorporate occasional irregular organic shapes and illustrated decorations.

- Use generous whitespace and clear visual hierarchy.

- Use friendly, rounded typography. Pair a playful display font such as Nunito or Quicksand with a highly readable body font.

- Use small, tasteful icons and original cartoon-style illustrations.

- Make the layout feel cohesive, with consistent spacing, icon styles and component shapes.

Animation and micro-interactions

The app should feel gently alive.

Include:

- Slow floating clouds, stars or decorative shapes in selected areas.

- A friendly mascot with subtle idle movement.

- Soft hover transitions on cards and buttons.

- A tiny bounce when a mood is selected.

- Smooth transitions when navigating between sections.

- A gentle progress animation when a focus session is completed.

- A small celebratory burst of stars or confetti when a user completes a meaningful goal.

- Animated chart entrances and progress indicators.

Animations must be lightweight, purposeful and subtle. Avoid excessive bouncing, flashing, constant movement or anything that makes reading difficult. Respect the user's reduced-motion accessibility preference.

2. Branding and mascot

The product name is MindPulse.

Create a simple, friendly logo combining a soft pulse or heartbeat motif with a small star or heart.

Introduce a small original cartoon mascot, such as a round lavender cloud-like character with tiny expressive eyes and a subtle blush. It can appear on the welcome screen, empty states, mood check-ins and completion moments.

The mascot should support the experience rather than dominate it. Do not use unrelated stock illustrations or inconsistent cartoon styles.

Use warm, encouraging microcopy. Examples:

- "Hey, let's check in with you."

- "You don't have to do it all today."

- "Small steps count, too."

- "A little progress is still progress."

- "What feels right for you today?"

Avoid guilt-inducing language, toxic positivity, streak pressure or messaging that makes users feel bad for missing a day.

3. Application structure and navigation

Build a real multi-section web application, not just a static landing page.

Include these primary sections:

1. Home dashboard

2. Mood journal

3. Focus timer

4. My schedule

5. Explore hobbies

6. Insights and progress

7. Settings and privacy

Use a compact left sidebar on desktop with the MindPulse logo, illustrated icons, clear active states and a profile area near the bottom. On mobile, use a suitable compact navigation pattern.

Keep navigation intuitive and consistent throughout the application.

4. Home dashboard

Make the dashboard the visual centrepiece of MindPulse.

Include:

- A friendly personalised greeting.

- The mascot and a small daily encouragement.

- A "How are you feeling today?" mood check-in card.

- A daily schedule preview.

- A prominent focus timer card.

- A compact weekly mood overview.

- A small personal-growth or hobby suggestion.

- A gentle summary of completed tasks and focus sessions.

Use a carefully composed layout with a mixture of card sizes and pastel backgrounds. Avoid filling every available space with information.

The first screen should feel welcoming and immediately communicate what the user can do next.

5. Mood journal

Create an interactive mood check-in experience.

Allow users to select from five expressive cartoon-style mood options, for example:

- Very low

- Low

- Okay

- Good

- Great

Each mood should have a distinct friendly expression, accessible text label and selected state. Do not communicate mood through colour alone.

Allow the user to record:

- Mood

- Optional energy level

- Optional emotion tags

- Optional personal note

- Date and time

After saving, show a gentle confirmation animation.

Include a calendar or timeline showing previous entries and a simple weekly mood visualisation.

Users must be able to view, edit and delete their own entries. Never fabricate mood history or imply that missing entries were recorded.

The app must present mood tracking as a personal reflection tool, not as a diagnostic or treatment system.

6. Focus timer

Build a functional Pomodoro-style timer, not a decorative mock-up.

Include:

- A large, friendly countdown display.

- Start, pause, resume and reset controls.

- Customisable focus and break durations.

- A circular progress indicator.

- An optional task name.

- A session-completion animation.

- A history of completed focus sessions.

Use pastel progress rings and small decorative illustrations. Keep the countdown highly readable.

The timer must work correctly when paused, resumed or reset. Handle browser tab changes and avoid relying on a simple repeating animation as the source of truth for time.

Record completed sessions accurately and let users review their history.

7. Personal schedule planner

Create a simple daily planner that lets users:

- Add and edit tasks.

- Set task titles, priorities, estimated durations and deadlines.

- Mark tasks as complete.

- View their day in a clear timeline or organised list.

- See planned versus completed tasks.

Use friendly category colours and small illustrated icons without sacrificing readability.

The planner should eventually support personalised recommendations based on user-entered information, mood logs and focus history.

For the initial version, use transparent, understandable scheduling rules. Explain why a recommendation appears and let users accept, reject or edit it. Do not claim to predict mental states or make medical conclusions.

8. Hobby and personal-growth explorer

Create a delightful discovery space where users can explore interests outside academics.

Include categories such as:

- Art and creativity

- Music

- Reading and writing

- Languages

- Movement and outdoor activities

- Practical skills

- Science and technology

- Mindful activities

Display each activity as a colourful illustrated card with:

- Activity title

- Short description

- Estimated time

- Difficulty level

- A "Try this" action

- A way to save favourites or mark an activity as tried

Include short, low-pressure activities suitable for a busy student. Suggestions should feel inviting rather than demanding.

Use illustrations and playful card layouts to make exploration feel like discovering little surprises.

9. Insights and behavioural patterns

Build a visual insights page that connects mood entries, focus sessions and task completion.

Include:

- Weekly and monthly mood trends.

- Focus time over time.

- Completed versus planned tasks.

- Personal routine summaries.

- Simple correlations where sufficient data exists.

Use rounded chart containers, pastel visualisations, clear legends and helpful labels. Avoid cluttered graphs and overly technical analytics.

Only show insights supported by the data actually available. Clearly indicate when there is insufficient information to identify a pattern.

Use cautious language such as "You logged higher energy on days with shorter focus sessions" rather than claiming that one behaviour caused another.

Make the insights useful, understandable and non-judgmental.

10. Functional requirements

This must be a working application, not merely a visual prototype.

Implement:

- Functional navigation.

- Working forms and buttons.

- Mood logging and history.

- A working focus timer.

- Task creation and completion.

- Hobby discovery and favourites.

- Data visualisations based on actual saved records.

- Loading, empty, success and error states.

- Responsive layouts for mobile, tablet and desktop.

- Accessible keyboard interactions and focus states.

- Data validation and clear feedback.

Persist data across page refreshes. If a backend is available, use secure authentication and a database with appropriate user-level access controls.

If a backend is not yet configured, build a clearly identified prototype using browser storage, keep the data layer modular, and explain which features require backend configuration. Never pretend that authentication, cloud synchronisation or secure server-side storage exists when it does not.

Never expose secret API keys or credentials in frontend code.

11. Technical implementation

Use React with TypeScript and a modern build setup such as Vite, if supported.

Use reusable components, clean naming, sensible folder organisation and maintainable styling.

Use a suitable charting library for the insights dashboard. Use lightweight animation techniques or a suitable animation library for the mascot and micro-interactions.

Avoid:

- One enormous component containing the entire app.

- Repeated hard-coded dummy data presented as real user history.

- Non-functional buttons.

- Placeholder links that lead nowhere.

- Unnecessary dependencies.

- Overengineering the initial release.

If the platform generates code, provide a clear project structure and explain how to run the application locally.

12. Build priorities

Implement the project in this order:

Priority 1: Design system, navigation, responsive layout and home dashboard.

Priority 2: Functional mood check-in, mood history and focus timer.

Priority 3: Task planner and hobby explorer.

Priority 4: Insights based on real saved data.

Priority 5: Authentication, persistent database, privacy controls, testing and deployment.

If the entire scope cannot be completed in one generation, build a polished and functional first version of the core experience before expanding.

13. Final quality standard

The final result should look like a carefully art-directed, production-quality wellness product.

It should be visually charming enough to make someone curious, simple enough to use daily, and technically structured well enough to extend into a serious portfolio project.

Prioritise visual consistency, delightful but restrained animation, genuine functionality, accessibility, privacy and maintainable code.

Do not stop at a landing page. Build the actual interactive application, test the main user flows and clearly identify anything that still requires configuration.

The core feeling should be: "This little space helps me understand myself, focus gently and make room for the things I love."

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/496d7cd1-88d1-5cec-af42-069923aa00fc).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
