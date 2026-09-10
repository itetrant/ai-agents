import React from 'react';

export default function Conventions() {
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
