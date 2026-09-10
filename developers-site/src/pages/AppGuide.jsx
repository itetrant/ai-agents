import React from 'react';

export default function AppGuide() {
  return (
    <article className="doc">
      <h1>Huong dan phat trien App/Backend (Node.js)</h1>

      <h2>Nguyen tac chung</h2>
      <ul>
        <li>Module CommonJS (<code>require</code>/<code>module.exports</code>) cho toan bo code server.</li>
        <li>Moi resource (vd. <code>orders</code>, <code>projects</code>) co 1 file router rieng trong <code>server/routes/</code>.</li>
        <li>Logic nghiep vu tach khoi route handler khi phuc tap (dat trong <code>server/services/</code>), route chi lam nhiem vu nhan request / tra response.</li>
        <li>Khong bao gio tin du lieu tu client: luon validate input o middleware hoac dau route handler.</li>
      </ul>

      <h2>Checklist bat buoc truoc khi len Production (STD-API-SD-001)</h2>
      <p>
        Chi tiet day du o trang <a href="#/api-standard">API Standard</a>.
        Toi thieu, moi service PHAI:
      </p>
      <ul>
        <li>Ten service theo <em>functional-name</em> da dang ky voi Architect/Infra (<a href="#/api-standard">muc 4</a>).</li>
        <li>Tu dang ky (self-registration) len Consul Service Discovery khi khoi dong, huy dang ky (deregister) khi shutdown (<a href="#/api-standard">muc 6, 8</a>).</li>
        <li>Co health check endpoint de Discovery loai bo instance loi.</li>
        <li>Expose <code>/api-docs</code> (OpenAPI 3.x) va <code>/metrics</code> (OpenMetrics, chan IP + header proxy) (<a href="#/api-standard">muc 10, 11</a>).</li>
        <li>Xac dinh <code>tenant_id</code>/<code>channel_id</code>/scope tu <code>X-Authenticated-Scope</code> da xac thuc, co lap du lieu theo ca hai (<a href="#/api-standard">muc 5</a>).</li>
        <li>Day log tap trung ve log-service voi retry + fallback local (<a href="#/api-standard">muc 12</a>).</li>
      </ul>
      <p>
        Ba dieu dau tien la ha tang/deploy (thuong do khung service chuan noi
        bo hoac Infra thiet lap). Hai dieu cuoi la code ban se viet trong
        moi service - xem vi du song day du trong{' '}
        <code>developers-site/server/</code>: <code>middleware/scopeContext.js</code>{' '}
        (co lap tenant/channel), <code>routes/orders.js</code> (ap dung vao
        mot resource that), <code>routes/metrics.js</code> (chan tang ung
        dung theo dung 2 lop cua muc 11.1).
      </p>

      <h2>Multi-tenant: middleware trich scope</h2>
      <p>
        Vi du tinh gian tu <code>server/middleware/scopeContext.js</code> -
        trich <code>tenant_id</code>/<code>channel_id</code>/quyen tu header{' '}
        <code>X-Authenticated-Scope</code> (do Kong hoac service chen sau
        khi xac thuc), tu choi som neu thieu tenant hoac channel:
      </p>
      <pre className="code-block">{`function scopeContext(req, res, next) {
  const { tenantIds, channelIds, permissions } = parseScope(
    req.get('x-authenticated-scope')
  );

  if (tenantIds.length !== 1) {
    return fail(res, 401, 'unauthorized', 'Scope phai chua dung mot muc "tenant:".');
  }
  if (channelIds.length === 0) {
    return fail(res, 401, 'unauthorized', 'Scope phai chua it nhat mot muc "channel:".');
  }

  req.ctx = { tenantId: tenantIds[0], channelIds, permissions };
  next();
}`}</pre>
      <p>
        Router chi loc du lieu qua <code>req.ctx</code>, KHONG BAO GIO qua
        gia tri client tu gui trong query/body (xem <code>routes/orders.js</code>{' '}
        va bang kiem thu bat buoc o muc 5.5 cua API Standard).
      </p>

      <h2>Vi du route dung quy uoc REST bo sung</h2>
      <p>
        Endpoint <code>/api/v1/projects</code> khong thuoc pham vi
        multi-tenant, minh hoa quy uoc envelope bo sung (xem{' '}
        <a href="#/api-standard">API Standard</a> - phan "Quy uoc REST bo
        sung"):
      </p>
      <pre className="code-block">{`// server/routes/projects.js
const express = require('express');
const { ok, fail } = require('../lib/envelope');

const router = express.Router();

router.get('/:id', (req, res) => {
  const project = findProjectById(req.params.id);
  if (!project) {
    return fail(res, 404, 'not_found', \`Khong tim thay project id=\${req.params.id}\`);
  }
  return ok(res, project);
});

module.exports = router;`}</pre>

      <h2>Xu ly loi tap trung</h2>
      <p>
        Dung 1 error-handling middleware o cuoi chuoi middleware de bat moi
        exception khong luong truoc va tra ve dung format cua API Standard,
        thay vi de Express tra HTML mac dinh.
      </p>
      <pre className="code-block">{`// server/middleware/errorHandler.js
const { fail } = require('../lib/envelope');

function errorHandler(err, req, res, next) { // eslint-disable-line
  console.error(err);
  fail(res, 500, 'internal_error', 'Da co loi khong mong muon xay ra.');
}

module.exports = errorHandler;

// server/index.js (mount SAU CUNG, sau moi route)
app.use(errorHandler);`}</pre>

      <h2>Logging</h2>
      <p>
        Log dang JSON mot dong (NDJSON), day tap trung ve log-service. Cau
        truc bat buoc theo <a href="#/api-standard">API Standard</a> muc 12.1
        (kem <code>tenant_id</code>/<code>channel_id</code> theo muc 5.3):
      </p>
      <pre className="code-block">{`{
  "timestamp": "2026-07-22T10:15:30.123+07:00",
  "level": "INFO",
  "service": "order-management",
  "env": "PROD",
  "version": "v1.2.0",
  "tenant_id": "12",
  "channel_id": 3,
  "trace_id": "a1b2c3d4e5f6",
  "method": "POST",
  "path": "/order/v1/orders",
  "status": 201,
  "duration_ms": 42,
  "message": "order created"
}`}</pre>
      <ul>
        <li>NGHIEM CAM ghi mat khau, token, so the, CVV hay dinh danh ca nhan day du vao log - masking truoc khi ghi.</li>
        <li>Loi ghi log KHONG BAO GIO duoc lam fail request nghiep vu - day log phai chay bat dong bo, co retry + fallback file local khi log-service khong phan hoi.</li>
      </ul>

      <h2>Cau hinh &amp; secrets</h2>
      <ul>
        <li>Doc cau hinh qua bien moi truong (<code>process.env</code>), khong hardcode.</li>
        <li>File <code>.env</code> khong duoc commit; chi commit <code>.env.example</code> lam mau.</li>
      </ul>

      <h2>Mobile app (React Native)</h2>
      <p>
        Voi app mobile, ap dung cung nguyen tac component/state nhu Web Guide,
        va bat buoc goi API qua cung 1 API Standard - khong tao rieng API cho
        mobile neu web da co san endpoint tuong duong.
      </p>
    </article>
  );
}
