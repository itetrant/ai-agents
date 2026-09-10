# developers.mmvietnam.com

Cong dev portal noi bo: huong dan phat trien app/web va bo **API Standard**
dung chung cho cac service cua mmvietnam.

Stack: **Node.js + Express** (CommonJS) cho backend, **React** (function
component + hooks, react-router-dom) cho frontend, build bang Webpack/Babel.

## Cai dat

```bash
cd developers-site
npm install
```

## Chay dev

```bash
npm run dev
```

Lenh nay chay song song `webpack --watch` (build lai `public/bundle.js` moi
khi sua code React) va Express server tai `http://localhost:4000`.

## Build production

```bash
npm run build   # -> public/bundle.js
npm run server  # node server/index.js
```

Doi port bang bien moi truong `PORT`.

## Cau truc

```
developers-site/
  server/
    index.js            # Express app, mount route + serve static frontend
    routes/projects.js   # vi du CRUD tuan theo API Standard
    middleware/auth.js    # vi du Bearer token middleware
    lib/envelope.js        # helper response envelope { data | error, meta }
  src/
    App.jsx              # routing (HashRouter)
    components/Layout.jsx # sidebar + khung trang
    pages/                # noi dung tai lieu (Home, GettingStarted, WebGuide,
                           # AppGuide, ApiStandard, Conventions)
  public/
    index.html
```

## Noi dung chinh

- **Bat dau** - cach cai dat, cau truc thu muc chuan cho du an moi.
- **Huong dan Web** - quy uoc React, vi du goi API dung API Standard.
- **Huong dan App/Backend** - quy uoc Node.js/Express, xu ly loi tap trung.
- **API Standard** - chuan REST: envelope response, versioning, phan trang,
  ma loi, auth, idempotency key. Vi du song chay ngay trong `server/`
  (`GET/POST/DELETE /api/v1/projects`, `GET /api/v1/health`).
- **Quy uoc & Code style** - dat ten, git/commit, PR checklist.

Day la site khoi tao voi noi dung best-practice chung (chua co san stack/API
that cua mmvietnam khi tao site nay) - cap nhat lai cac trang trong `src/pages/`
khi co quy dinh chinh thuc cua to chuc.
