import React from 'react';

export default function AppGuide() {
  return (
    <article className="doc">
      <h1>Huong dan phat trien App/Backend (Node.js)</h1>

      <h2>Nguyen tac chung</h2>
      <ul>
        <li>Module CommonJS (<code>require</code>/<code>module.exports</code>) cho toan bo code server.</li>
        <li>Moi resource (vd. <code>projects</code>, <code>users</code>) co 1 file router rieng trong <code>server/routes/</code>.</li>
        <li>Logic nghiep vu tach khoi route handler khi phuc tap (dat trong <code>server/services/</code>), route chi lam nhiem vu nhan request / tra response.</li>
        <li>Khong bao gio tin du lieu tu client: luon validate input o middleware hoac dau route handler.</li>
      </ul>

      <h2>Vi du route chuan (tuan theo API Standard)</h2>
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
      <ul>
        <li>Log co cau truc (JSON) cho moi request quan trong: method, path, status, thoi gian xu ly.</li>
        <li>Khong log du lieu nhay cam (mat khau, token, so the).</li>
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
