import React from 'react';

export default function AppGuide() {
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
