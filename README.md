# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## Batch CSV Import (QR Builder)

This app supports CSV import for batch vCard QR generation.

- Place example CSV files in `template/` and use the **Use Example** button.
- The CSV parser uses PapaParse and accepts headers in any order. Use **Auto-map** to attempt automatic header mapping.
- If auto-map does not match your column names, use the header mapping UI to map CSV columns to the vCard fields:
  - `Firstname`, `Lastname`, `Organization`, `Position (Work)`, `Phone (Work)`, `Phone (Mobile)`, `Email`, `Street`, `Zipcode`, `City`
- After clicking **Import**, you'll enter batch-review mode where you can preview and export.
- Use **Export** to generate PNG or SVG images for each vCard; images are bundled into a zip for download.

If you want custom behavior (different columns, additional vCard fields), adjust the mapping UI in `src/components/BatchUpload.jsx` or the `generateVCard` method in `src/utils/vcard.js`.
