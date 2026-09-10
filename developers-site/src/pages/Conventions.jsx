import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function Conventions() {
  const { lang } = useLanguage();

  if (lang === 'en') {
    return (
      <article className="doc">
        <h1>Conventions &amp; Code Style</h1>

        <h2>Naming</h2>
        <ul>
          <li>React component files: <code>PascalCase.jsx</code> (e.g. <code>ProjectList.jsx</code>).</li>
          <li>Plain Node files (route, lib, middleware): <code>camelCase.js</code>.</li>
          <li>Variables &amp; functions (JavaScript): <code>camelCase</code>. Fixed constants: <code>UPPER_SNAKE_CASE</code>.</li>
          <li>
            JSON API fields: <strong>snake_case</strong> (<code>order_id</code>,{' '}
            <code>created_at</code>, <code>total_amount</code>) - mandatory per{' '}
            <a href="#/api-standard">API Standard</a> (STD-API-SD-001 section 4.5),
            applying to both request and response bodies. Only internal
            variables/functions in JS code use camelCase.
          </li>
          <li>
            Service names (functional-name): lowercase, hyphen-separated, in
            the form <code>{'<domain>-<component>'}</code> (e.g.{' '}
            <code>order-management</code>) - see the domain catalog in{' '}
            <a href="#/api-standard">API Standard</a> section 4.
          </li>
        </ul>

        <h2>Module system</h2>
        <p>
          The entire backend uses <strong>CommonJS</strong> (<code>require</code> /
          <code> module.exports</code>) to stay consistent with existing
          Node.js services. The frontend uses ES module + JSX syntax,
          compiled by Babel/webpack before running in the browser.
        </p>

        <h2>Git &amp; commits</h2>
        <ul>
          <li>Branches named as <code>feature/...</code>, <code>fix/...</code>, <code>chore/...</code>.</li>
          <li>Commit messages should be concise, describing "why" rather than just "what".</li>
          <li>Don't commit <code>node_modules/</code>, build output (<code>public/bundle.js</code>), or <code>.env</code>.</li>
        </ul>

        <h2>Pull request checklist</h2>
        <ul>
          <li>Lint/build passed successfully locally.</li>
          <li>New/updated endpoints follow the <a href="#/api-standard">API Standard</a>.</li>
          <li>No sensitive data logged/committed (tokens, passwords, PII).</li>
          <li>PR has a short description: what changed, and why.</li>
        </ul>

        <h2>Error handling</h2>
        <ul>
          <li>Backend: never let an exception escape unhandled - always respond using the API Standard's envelope.</li>
          <li>Frontend: every API error must be shown to the user in an understandable way - never leave a blank page or a silent console error.</li>
        </ul>
      </article>
    );
  }

  return (
    <article className="doc">
      <h1>Quy ước &amp; Code style</h1>

      <h2>Đặt tên</h2>
      <ul>
        <li>File React component: <code>PascalCase.jsx</code> (vd. <code>ProjectList.jsx</code>).</li>
        <li>File Node thuần (route, lib, middleware): <code>camelCase.js</code>.</li>
        <li>Biến &amp; hàm (JavaScript): <code>camelCase</code>. Hằng số cố định: <code>UPPER_SNAKE_CASE</code>.</li>
        <li>
          Field trong JSON API: <strong>snake_case</strong> (<code>order_id</code>,{' '}
          <code>created_at</code>, <code>total_amount</code>) - bắt buộc theo{' '}
          <a href="#/api-standard">API Standard</a> (STD-API-SD-001 mục 4.5),
          áp dụng cả cho request lẫn response body. Chỉ biến/hàm nội bộ trong
          code JS mới dùng camelCase.
        </li>
        <li>
          Tên service (functional-name): chữ thường, phân cách bằng dấu gạch
          ngang, dạng <code>{'<domain>-<component>'}</code> (vd.{' '}
          <code>order-management</code>) - xem danh mục domain trong{' '}
          <a href="#/api-standard">API Standard</a> mục 4.
        </li>
      </ul>

      <h2>Module system</h2>
      <p>
        Toàn bộ backend dùng <strong>CommonJS</strong> (<code>require</code> /
        <code> module.exports</code>) để đồng bộ với các service Node.js hiện
        có. Frontend dùng cú pháp ES module + JSX, được Babel/webpack biên dịch
        lại trước khi chạy trên trình duyệt.
      </p>

      <h2>Git &amp; commit</h2>
      <ul>
        <li>Nhánh đặt tên theo dạng <code>feature/...</code>, <code>fix/...</code>, <code>chore/...</code>.</li>
        <li>Commit message ngắn gọn, mô tả "tại sao" thay vì chỉ "làm gì".</li>
        <li>Không commit <code>node_modules/</code>, file build (<code>public/bundle.js</code>), hoặc <code>.env</code>.</li>
      </ul>

      <h2>Pull request checklist</h2>
      <ul>
        <li>Đã chạy lint/build thành công ở local.</li>
        <li>Endpoint mới/sửa tuân theo <a href="#/api-standard">API Standard</a>.</li>
        <li>Không log/commit dữ liệu nhạy cảm (token, mật khẩu, PII).</li>
        <li>Có mô tả ngắn trong PR: thay đổi gì, tại sao cần thay đổi.</li>
      </ul>

      <h2>Xử lý lỗi</h2>
      <ul>
        <li>Backend: không bao giờ để exception rơi ra ngoài không xử lý - luôn trả lỗi theo đúng envelope của API Standard.</li>
        <li>Frontend: mọi lỗi từ API phải được hiển thị cho người dùng ở dạng dễ hiểu, không để trắng trang hoặc console error im lặng.</li>
      </ul>
    </article>
  );
}
