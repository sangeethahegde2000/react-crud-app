# react-crud-app

Short README for this project.

## Setup

- Install dependencies:

```bash
npm install
```

- Start the mock API (json-server):

```bash
npm run serve:api
# JSON API served at http://localhost:3000
```

- Start the frontend dev server:

```bash
npm run dev
# Vite dev server (usually http://localhost:5173)
```

## Where to look in the code
- App entry: [src/main.tsx](src/main.tsx)
- Page layout and dialog wiring: [src/App.tsx](src/App.tsx)
- User table + search + pagination: [src/components/UserList.tsx](src/components/UserList.tsx)
- Form driven by schema: [src/components/UserForm.tsx](src/components/UserForm.tsx)
- Field definitions & validation: [src/schema/userSchema.ts](src/schema/userSchema.ts)
- Types: [src/types/user.ts](src/types/user.ts)
- API client: [src/services/api.ts](src/services/api.ts)
- Mock database: [db.json](db.json)

## Add a new field to the user form

1. Update the TypeScript type: add the new property to [src/types/user.ts](src/types/user.ts).
2. Add the field definition to [src/schema/userSchema.ts](src/schema/userSchema.ts): add an entry to `userFields` with `name`, `label`, `type`, and `required`.
  - The `UserForm` maps `userFields` to inputs automatically, so the form will render the new field.
3. (Optional) Update `db.json` sample records so the new field appears in existing sample data.
4. If you need custom validation, extend the validator in `userSchema.ts`.

## Assumptions and design notes

- UI library: Material UI (MUI) is used for components and layout.
- Form driven by a central schema (`src/schema/userSchema.ts`) so fields are easy to add/remove.
- The app uses a mock JSON API (`json-server`) for local development.
- Pagination and search are client-side (suitable for small datasets). For larger datasets, implement server-side pagination and search in `src/services/api.ts` and update `getUsers` accordingly.
- The form opens in a modal dialog for add/edit; initial view shows only the table.

If you'd like, I can also add a CONTRIBUTING section, CI steps, or scripts to seed `db.json`.
    - Types: [src/types/user.ts](src/types/user.ts)

    - API client: [src/services/api.ts](src/services/api.ts)
