import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function AppGuide() {
  const { lang } = useLanguage();

  if (lang === 'en') {
    return (
      <article className="doc">
        <h1>App/Backend Development Guide (Node.js)</h1>

        <h2>General principles</h2>
        <ul>
          <li>CommonJS modules (<code>require</code>/<code>module.exports</code>) for all server code.</li>
          <li>Each resource (e.g. <code>orders</code>, <code>projects</code>) has its own router file under <code>server/routes/</code>.</li>
          <li>Business logic is separated from the route handler when it gets complex (placed under <code>server/services/</code>) - the route's job is just to receive the request / return the response.</li>
          <li>Never trust data from the client: always validate input in middleware or at the top of the route handler.</li>
        </ul>

        <h2>Mandatory checklist before going to Production (STD-API-SD-001)</h2>
        <p>
          Full details on the <a href="#/api-standard">API Standard</a> page.
          At a minimum, every service MUST:
        </p>
        <ul>
          <li>Have a service name following <em>functional-name</em>, registered with Architect/Infra (<a href="#/api-standard">section 4</a>).</li>
          <li>Self-register (self-registration) on Consul Service Discovery on startup, and deregister on graceful shutdown (<a href="#/api-standard">sections 6, 8</a>).</li>
          <li>Provide a health check endpoint so Discovery can remove failing instances.</li>
          <li>Expose <code>/api-docs</code> (OpenAPI 3.x) and <code>/metrics</code> (OpenMetrics, IP + proxy header blocking) (<a href="#/api-standard">sections 10, 11</a>).</li>
          <li>Determine <code>tenant_id</code>/<code>channel_id</code>/scope from the authenticated <code>X-Authenticated-Scope</code>, isolating data by both (<a href="#/api-standard">section 5</a>).</li>
          <li>Ship centralized logs to log-service with retry + local fallback (<a href="#/api-standard">section 12</a>).</li>
        </ul>
        <p>
          The first three items are infrastructure/deploy concerns (usually
          handled by the internal standard service scaffold or by Infra).
          The last two are code you'll write in every service - see the full
          live example in <code>developers-site/server/</code>:{' '}
          <code>middleware/scopeContext.js</code> (tenant/channel isolation),{' '}
          <code>routes/orders.js</code> (applied to a real resource),{' '}
          <code>routes/metrics.js</code> (application-layer blocking exactly
          per the two layers in section 11.1).
        </p>

        <h2>Multi-tenant: scope-extraction middleware</h2>
        <p>
          A simplified example from <code>server/middleware/scopeContext.js</code>{' '}
          - extracts <code>tenant_id</code>/<code>channel_id</code>/permissions
          from the <code>X-Authenticated-Scope</code> header (injected by
          Kong or the service itself after authentication), rejecting early
          if tenant or channel is missing:
        </p>
        <pre className="code-block">{`function scopeContext(req, res, next) {
  const { tenantIds, channelIds, permissions } = parseScope(
    req.get('x-authenticated-scope')
  );

  if (tenantIds.length !== 1) {
    return fail(res, 401, 'unauthorized', 'Scope must contain exactly one "tenant:" entry.');
  }
  if (channelIds.length === 0) {
    return fail(res, 401, 'unauthorized', 'Scope must contain at least one "channel:" entry.');
  }

  req.ctx = { tenantId: tenantIds[0], channelIds, permissions };
  next();
}`}</pre>
        <p>
          The router only filters data through <code>req.ctx</code>, NEVER
          through values the client sends in the query/body (see{' '}
          <code>routes/orders.js</code> and the mandatory test table in
          section 5.5 of the API Standard).
        </p>

        <h2>Example route using the additional REST convention</h2>
        <p>
          The <code>/api/v1/projects</code> endpoint is outside the
          multi-tenant scope, and illustrates the additional envelope
          convention (see <a href="#/api-standard">API Standard</a> -
          "Additional REST conventions" section):
        </p>
        <pre className="code-block">{`// server/routes/projects.js
const express = require('express');
const { ok, fail } = require('../lib/envelope');

const router = express.Router();

router.get('/:id', (req, res) => {
  const project = findProjectById(req.params.id);
  if (!project) {
    return fail(res, 404, 'not_found', \`Project id=\${req.params.id} not found\`);
  }
  return ok(res, project);
});

module.exports = router;`}</pre>

        <h2>Centralized error handling</h2>
        <p>
          Use one error-handling middleware at the end of the middleware
          chain to catch any unforeseen exception and return it in the
          correct API Standard format, instead of letting Express return
          its default HTML.
        </p>
        <pre className="code-block">{`// server/middleware/errorHandler.js
const { fail } = require('../lib/envelope');

function errorHandler(err, req, res, next) { // eslint-disable-line
  console.error(err);
  fail(res, 500, 'internal_error', 'An unexpected error occurred.');
}

module.exports = errorHandler;

// server/index.js (mount LAST, after all routes)
app.use(errorHandler);`}</pre>

        <h2>Logging</h2>
        <p>
          Single-line JSON logs (NDJSON), shipped centrally to log-service.
          Mandatory structure per <a href="#/api-standard">API Standard</a>{' '}
          section 12.1 (including <code>tenant_id</code>/<code>channel_id</code>{' '}
          per section 5.3):
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
          <li>NEVER log passwords, tokens, card numbers, CVVs, or full personal identifiers - mask them before writing.</li>
          <li>Logging failures must NEVER fail the business request - shipping logs must run asynchronously, with retry + local file fallback when log-service doesn't respond.</li>
        </ul>

        <h2>Configuration &amp; secrets</h2>
        <ul>
          <li>Read configuration via environment variables (<code>process.env</code>), never hardcode.</li>
          <li><code>.env</code> files must never be committed; only commit <code>.env.example</code> as a template.</li>
        </ul>

        <h2>Mobile app (React Native)</h2>
        <p>
          For mobile apps, apply the same component/state principles as the
          Web Guide, and always call the API through the same API Standard -
          don't build a separate API for mobile if the web app already has
          an equivalent endpoint.
        </p>
      </article>
    );
  }

  return (
    <article className="doc">
      <h1>Hướng dẫn phát triển App/Backend (Node.js)</h1>

      <h2>Nguyên tắc chung</h2>
      <ul>
        <li>Module CommonJS (<code>require</code>/<code>module.exports</code>) cho toàn bộ code server.</li>
        <li>Mỗi resource (vd. <code>orders</code>, <code>projects</code>) có 1 file router riêng trong <code>server/routes/</code>.</li>
        <li>Logic nghiệp vụ tách khỏi route handler khi phức tạp (đặt trong <code>server/services/</code>), route chỉ làm nhiệm vụ nhận request / trả response.</li>
        <li>Không bao giờ tin dữ liệu từ client: luôn validate input ở middleware hoặc đầu route handler.</li>
      </ul>

      <h2>Checklist bắt buộc trước khi lên Production (STD-API-SD-001)</h2>
      <p>
        Chi tiết đầy đủ ở trang <a href="#/api-standard">API Standard</a>.
        Tối thiểu, mọi service PHẢI:
      </p>
      <ul>
        <li>Tên service theo <em>functional-name</em> đã đăng ký với Architect/Infra (<a href="#/api-standard">mục 4</a>).</li>
        <li>Tự đăng ký (self-registration) lên Consul Service Discovery khi khởi động, hủy đăng ký (deregister) khi shutdown (<a href="#/api-standard">mục 6, 8</a>).</li>
        <li>Có health check endpoint để Discovery loại bỏ instance lỗi.</li>
        <li>Expose <code>/api-docs</code> (OpenAPI 3.x) và <code>/metrics</code> (OpenMetrics, chặn IP + header proxy) (<a href="#/api-standard">mục 10, 11</a>).</li>
        <li>Xác định <code>tenant_id</code>/<code>channel_id</code>/scope từ <code>X-Authenticated-Scope</code> đã xác thực, cô lập dữ liệu theo cả hai (<a href="#/api-standard">mục 5</a>).</li>
        <li>Đẩy log tập trung về log-service với retry + fallback local (<a href="#/api-standard">mục 12</a>).</li>
      </ul>
      <p>
        Ba điều đầu tiên là hạ tầng/deploy (thường do khung service chuẩn nội
        bộ hoặc Infra thiết lập). Hai điều cuối là code bạn sẽ viết trong
        mỗi service - xem ví dụ sống đầy đủ trong{' '}
        <code>developers-site/server/</code>: <code>middleware/scopeContext.js</code>{' '}
        (cô lập tenant/channel), <code>routes/orders.js</code> (áp dụng vào
        một resource thật), <code>routes/metrics.js</code> (chặn tầng ứng
        dụng theo đúng 2 lớp của mục 11.1).
      </p>

      <h2>Multi-tenant: middleware trích scope</h2>
      <p>
        Ví dụ tinh gọn từ <code>server/middleware/scopeContext.js</code> -
        trích <code>tenant_id</code>/<code>channel_id</code>/quyền từ header{' '}
        <code>X-Authenticated-Scope</code> (do Kong hoặc service chèn sau
        khi xác thực), từ chối sớm nếu thiếu tenant hoặc channel:
      </p>
      <pre className="code-block">{`function scopeContext(req, res, next) {
  const { tenantIds, channelIds, permissions } = parseScope(
    req.get('x-authenticated-scope')
  );

  if (tenantIds.length !== 1) {
    return fail(res, 401, 'unauthorized', 'Scope phải chứa đúng một mục "tenant:".');
  }
  if (channelIds.length === 0) {
    return fail(res, 401, 'unauthorized', 'Scope phải chứa ít nhất một mục "channel:".');
  }

  req.ctx = { tenantId: tenantIds[0], channelIds, permissions };
  next();
}`}</pre>
      <p>
        Router chỉ lọc dữ liệu qua <code>req.ctx</code>, KHÔNG BAO GIỜ qua
        giá trị client tự gửi trong query/body (xem <code>routes/orders.js</code>{' '}
        và bảng kiểm thử bắt buộc ở mục 5.5 của API Standard).
      </p>

      <h2>Ví dụ route dùng quy ước REST bổ sung</h2>
      <p>
        Endpoint <code>/api/v1/projects</code> không thuộc phạm vi
        multi-tenant, minh họa quy ước envelope bổ sung (xem{' '}
        <a href="#/api-standard">API Standard</a> - phần "Quy ước REST bổ
        sung"):
      </p>
      <pre className="code-block">{`// server/routes/projects.js
const express = require('express');
const { ok, fail } = require('../lib/envelope');

const router = express.Router();

router.get('/:id', (req, res) => {
  const project = findProjectById(req.params.id);
  if (!project) {
    return fail(res, 404, 'not_found', \`Không tìm thấy project id=\${req.params.id}\`);
  }
  return ok(res, project);
});

module.exports = router;`}</pre>

      <h2>Xử lý lỗi tập trung</h2>
      <p>
        Dùng 1 error-handling middleware ở cuối chuỗi middleware để bắt mọi
        exception không lường trước và trả về đúng format của API Standard,
        thay vì để Express trả HTML mặc định.
      </p>
      <pre className="code-block">{`// server/middleware/errorHandler.js
const { fail } = require('../lib/envelope');

function errorHandler(err, req, res, next) { // eslint-disable-line
  console.error(err);
  fail(res, 500, 'internal_error', 'Đã có lỗi không mong muốn xảy ra.');
}

module.exports = errorHandler;

// server/index.js (mount SAU CÙNG, sau mọi route)
app.use(errorHandler);`}</pre>

      <h2>Logging</h2>
      <p>
        Log dạng JSON một dòng (NDJSON), đẩy tập trung về log-service. Cấu
        trúc bắt buộc theo <a href="#/api-standard">API Standard</a> mục 12.1
        (kèm <code>tenant_id</code>/<code>channel_id</code> theo mục 5.3):
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
        <li>NGHIÊM CẤM ghi mật khẩu, token, số thẻ, CVV hay định danh cá nhân đầy đủ vào log - masking trước khi ghi.</li>
        <li>Lỗi ghi log KHÔNG BAO GIỜ được làm fail request nghiệp vụ - đẩy log phải chạy bất đồng bộ, có retry + fallback file local khi log-service không phản hồi.</li>
      </ul>

      <h2>Cấu hình &amp; secrets</h2>
      <ul>
        <li>Đọc cấu hình qua biến môi trường (<code>process.env</code>), không hardcode.</li>
        <li>File <code>.env</code> không được commit; chỉ commit <code>.env.example</code> làm mẫu.</li>
      </ul>

      <h2>Mobile app (React Native)</h2>
      <p>
        Với app mobile, áp dụng cùng nguyên tắc component/state như Web Guide,
        và bắt buộc gọi API qua cùng 1 API Standard - không tạo riêng API cho
        mobile nếu web đã có sẵn endpoint tương đương.
      </p>
    </article>
  );
}
