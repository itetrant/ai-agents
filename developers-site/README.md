# developers.mmvietnam.com

Cong dev portal noi bo cua MM Mega Market Vietnam (MMVN): huong dan phat
trien app/web, va **API Standard** (STD-API-SD-001 v1.1) - chuan bat buoc
cho moi API service cua MMVN (Service Discovery, naming, multi-tenant/OAuth2,
Kong Gateway, `/api-docs`, `/metrics`, logging, Kafka).

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

Doi port bang bien moi truong `PORT`. Bien `PROMETHEUS_IPS` (danh sach IP,
phan cach boi dau phay) gioi han truy cap `/metrics` - de trong chi de test
cuc bo, PROD bat buoc phai cau hinh.

## Deploy len Vercel

Repo da co san `vercel.json` + `api/index.js` (serverless entrypoint bao
`server/app.js`) - `public/` duoc build va serve tinh, `/api/*` va `/metrics`
chay qua serverless function.

**Cach 1 - qua dashboard (khuyen nghi, khong can token):**
1. Vao vercel.com &rarr; New Project &rarr; import repo GitHub nay.
2. Set **Root Directory** = `developers-site`.
3. Build Command / Output Directory de mac dinh (da khai bao trong `vercel.json`).
4. Deploy - moi lan push len nhanh nay se tu dong deploy lai.

**Cach 2 - qua CLI:**
```bash
cd developers-site
npx vercel --prod
```

Luu y: cac resource mau (`orders`, `projects`) luu trong bo nho (in-memory
array) - tren Vercel moi serverless invocation co the chay tren instance
khac nhau nen du lieu tao qua `POST` **khong dam bao ton tai** giua cac
request. Day la gioi han chap nhan duoc cho site demo/tai lieu; mot service
that phai dung database ben ngoai.

## Cau truc

```
developers-site/
  server/
    index.js                  # Express app, mount route + serve static frontend
    routes/orders.js           # vi du SONG thuc thi STD-API-SD-001 muc 5
                                 # (multi-tenant/multi-channel qua scope)
    routes/metrics.js           # vi du SONG guard /metrics theo muc 11.1
    routes/projects.js           # vi du CRUD theo quy uoc REST bo sung
    middleware/scopeContext.js    # trich tenant_id/channel_id/quyen tu
                                    # header X-Authenticated-Scope
    middleware/auth.js              # vi du Bearer token (chi cho /projects)
    lib/envelope.js                  # helper response envelope { data | error, meta }
    lib/metrics.js                    # dang ky prom-client + default metrics
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
- **Huong dan Web** - quy uoc React, vi du goi API.
- **Huong dan App/Backend** - checklist tuan thu STD-API-SD-001, middleware
  scope, xu ly loi tap trung, dinh dang log chinh thuc.
- **API Standard** - toan bo noi dung STD-API-SD-001 v1.1 (chinh thuc, bat
  buoc): Service Discovery, naming rule, multi-tenant/multi-channel qua
  OAuth2 scope, Kong Gateway, `/api-docs`, `/metrics`, logging + retry/
  fallback, Kafka. Kem phan "Quy uoc REST bo sung" (envelope response, phan
  trang, idempotency key) cho nhung gi tai lieu chinh thuc chua quy dinh.
- **Quy uoc & Code style** - dat ten (snake_case cho JSON field theo chuan
  chinh thuc), git/commit, PR checklist.

## Vi du song thuc thi chuan chinh thuc

```bash
# Multi-tenant: chi thay du lieu cua dung tenant + channel trong scope
curl http://localhost:4000/api/v1/orders \
  -H "X-Authenticated-Scope: tenant:12 channel:3 channel:4 order.read"

# Ghi du lieu tren token nhieu channel - bat buoc X-Channel-Id trong scope
curl -X POST http://localhost:4000/api/v1/orders \
  -H "X-Authenticated-Scope: tenant:12 channel:3 channel:4 order.write" \
  -H "X-Channel-Id: 3" -H "Content-Type: application/json" \
  -d '{"total_amount": 250000}'

# /metrics - tu choi neu request di qua proxy (mo phong Kong)
curl -i http://localhost:4000/metrics -H "X-Forwarded-For: 1.2.3.4"  # -> 404
```

Toan bo kich ban trong bang kiem thu bat buoc cua STD-API-SD-001 muc 5.5
(401/403/400/404 cho tung truong hop sai scope/channel) da duoc thuc thi va
kiem tra trong `server/routes/orders.js`.
