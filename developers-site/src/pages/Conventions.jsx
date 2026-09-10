import React from 'react';

export default function Conventions() {
  return (
    <article className="doc">
      <h1>Quy uoc &amp; Code style</h1>

      <h2>Dat ten</h2>
      <ul>
        <li>File React component: <code>PascalCase.jsx</code> (vd. <code>ProjectList.jsx</code>).</li>
        <li>File Node thuan (route, lib, middleware): <code>camelCase.js</code>.</li>
        <li>Bien &amp; ham (JavaScript): <code>camelCase</code>. Hang so co dinh: <code>UPPER_SNAKE_CASE</code>.</li>
        <li>
          Field trong JSON API: <strong>snake_case</strong> (<code>order_id</code>,{' '}
          <code>created_at</code>, <code>total_amount</code>) - bat buoc theo{' '}
          <a href="#/api-standard">API Standard</a> (STD-API-SD-001 muc 4.5),
          ap dung ca cho request lan response body. Chi bien/ham noi bo trong
          code JS moi dung camelCase.
        </li>
        <li>
          Ten service (functional-name): chu thuong, phan cach bang dau gach
          ngang, dang <code>{'<domain>-<component>'}</code> (vd.{' '}
          <code>order-management</code>) - xem danh muc domain trong{' '}
          <a href="#/api-standard">API Standard</a> muc 4.
        </li>
      </ul>

      <h2>Module system</h2>
      <p>
        Toan bo backend dung <strong>CommonJS</strong> (<code>require</code> /
        <code> module.exports</code>) de dong bo voi cac service Node.js hien
        co. Frontend dung cu phap ES module + JSX, duoc Babel/webpack bien dich
        lai truoc khi chay tren trinh duyet.
      </p>

      <h2>Git &amp; commit</h2>
      <ul>
        <li>Nhanh dat ten theo dang <code>feature/...</code>, <code>fix/...</code>, <code>chore/...</code>.</li>
        <li>Commit message ngan gon, mo ta "tai sao" thay vi chi "lam gi".</li>
        <li>Khong commit <code>node_modules/</code>, file build (<code>public/bundle.js</code>), hoac <code>.env</code>.</li>
      </ul>

      <h2>Pull request checklist</h2>
      <ul>
        <li>Da chay lint/build thanh cong o local.</li>
        <li>Endpoint moi/sua tuan theo <a href="#/api-standard">API Standard</a>.</li>
        <li>Khong log/commit du lieu nhay cam (token, mat khau, PII).</li>
        <li>Co mo ta ngan trong PR: thay doi gi, tai sao can thay doi.</li>
      </ul>

      <h2>Xu ly loi</h2>
      <ul>
        <li>Backend: khong bao gio de exception roi ra ngoai khong xu ly - luon tra loi theo dung envelope cua API Standard.</li>
        <li>Frontend: moi loi tu API phai duoc hien thi cho nguoi dung o dang de hieu, khong de trang trang hoac console error im lang.</li>
      </ul>
    </article>
  );
}
