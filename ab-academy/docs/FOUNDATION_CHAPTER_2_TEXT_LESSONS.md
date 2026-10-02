# Foundation Chapter 2: Text Lessons

Chapter 2 (Foundation module `sortOrder = 20`) replaces the obsolete Business & Branding lessons with ten readable lessons and one companion workbook. Chapter 1 continues to use Vimeo lessons unchanged.

## Chapter title

The module keeps its current production title, **Business & Branding Essentials**, until a final title is approved. "Haircut Development, Product Knowledge & Clientele Building" is only the manuscript's working title. The content import never changes the title. To rename later:

1. Add the approved title to the Foundation allow-list in `src/lib/data/course-visibility.ts` and deploy (a title missing from the list hides the chapter from students).
2. `npx tsx prisma/rename-chapter-2-module.ts --title "<title>"` (dry run), then add `--apply`.

## Rendering rule

`getLessonContentKind` (`src/lib/lessons/lesson-content.ts`) decides how a lesson renders:

1. `videoUrl` is set → the existing Vimeo experience, unchanged.
2. No `videoUrl` and a non-empty `body` → text lesson: server-rendered Markdown (`react-markdown`, raw HTML skipped) plus `TextLessonProgress`.
3. Neither → the existing "Video coming soon" state.

## Progress

Text lessons use the existing `POST /api/student/courses/[slug]/lessons/[lessonSlug]/progress` route, sending status updates only:

- Opening a `NOT_STARTED` lesson sends `{ "status": "IN_PROGRESS" }` once.
- **Mark lesson complete** sends `{ "status": "COMPLETED" }`, then refreshes server data so course progress updates.
- The route never downgrades a completed lesson, and the client ignores late responses that would move status backwards.
- Text lessons never send `SAVE_POSITION`; `lastPositionSeconds` stays `0`.

## Duration

Text lesson `duration` is computed from the Markdown body at 200 words per minute, rounded up (`getReadingTimeLabel`, e.g. `8 min read`). It is computed at import/seed time, never hand-entered.

## Workbook

The workbook is a chapter resource on `Module.resourceTitle` / `Module.resourceUrl`, shown on each Chapter 2 lesson page and in the course Resources tab (opens in a new tab, labelled "(PDF)"). It is not a lesson.

- **Source:** `prisma/content/foundation-chapter-2/workbook.md`, a word-for-word export of the "Artisan Academy — Chapter 2 Workbook" Google Doc. Never link students to the Google Doc.
- **PDF:** `course-resources/foundation/chapter-2-workbook.pdf`, built with `npx tsx scripts/build-chapter-2-workbook.ts` (local Chrome). The layout adds writing lines after prompts and starts each lesson on a new page; `scripts/workbook-layout.test.ts` checks the wording is unchanged. Rebuild and commit the PDF whenever the source changes.
- **Route:** `GET /student/courses/foundation/resources/chapter-2-workbook.pdf` (`src/app/(account)/student/courses/[slug]/resources/[file]/route.ts`). `proxy.ts` sends visitors without a session to `/login?next=…`; the route then requires a student-experience role (403 otherwise) and an active or completed enrollment in the published course whose visible module links to the file (404 otherwise). Files are registered in `src/lib/course-resources.ts` and traced into the function via `outputFileTracingIncludes` in `next.config.ts`; they are deliberately not in `public/`.
- `chapter2Module.resourceUrl` points at the route, so the import sets it. When the lessons already match the content files, the import updates only module fields and leaves lessons and progress untouched.

## Content files

- Metadata (titles, order, optional descriptions, module description, resource): `prisma/foundation-chapter-2.ts`
- Lesson bodies: `prisma/content/foundation-chapter-2/2-XX-*.md`, one file per lesson

The checked-in files are placeholders containing `<!-- PLACEHOLDER`. To load the approved manuscript:

1. Replace each file's entire contents with that lesson's approved Markdown. Do not repeat the lesson title as a heading, because the page already renders it. Any `#` heading renders as a section heading.
2. Set `chapter2Module.description` (required; approved Oct. 2026) and, optionally, each lesson's `description` in `prisma/foundation-chapter-2.ts`.
3. Run `npm test` and `npm run build`.

## Import (not yet run against any database)

`prisma/seed.ts` is development-only. It resets seeded credentials and must never run against production.

Production uses `prisma/import-chapter-2-text-lessons.ts`:

```bash
npx tsx prisma/import-chapter-2-text-lessons.ts          # dry run: reads only
npx tsx prisma/import-chapter-2-text-lessons.ts --apply  # one Serializable transaction
```

Before touching the database, the script refuses to run if any lesson body is a placeholder or empty, or if the module description is missing. It then:

- requires exactly one Foundation module at `sortOrder = 20` whose title is in the visibility allow-list, containing either exactly the seven obsolete lessons or the ten approved lessons from an earlier import;
- prints the full plan: module fields to update or keep, lessons to delete (with progress counts), lessons to create;
- updates only `description`, `resourceTitle` and `resourceUrl` on the module, keeping its id, `sortOrder` and title;
- aborts without changes if any `LessonProgress` exists on the lessons it would replace;
- deletes and recreates the lessons inside the transaction, keeping the module id and `sortOrder`;
- is a no-op when the database already matches the content files;
- re-reads and verifies the result.

## Rollout order

1. Rehearse on a Neon branch created from production: `prisma migrate deploy`, import dry run, `--apply`, then smoke tests.
2. Production: read-only checks, then `prisma migrate deploy` (migration `20260925120000_add_text_lesson_content`, additive nullable columns). This must happen before the code deploys, because the new code selects the new columns.
3. Deploy the code.
4. Run the import dry run, then `--apply`, then verify read-only.
5. Once the final title is approved, rename with `prisma/rename-chapter-2-module.ts` (see Chapter title), then remove unused titles from the visibility allow-list.

Each database step requires explicit approval, per [`plans.md`](plans.md#database-safety-and-migration-policy).
