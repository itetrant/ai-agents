import React from 'react';

export default function WebGuide() {
  return (
    <article className="doc">
      <h1>Hướng dẫn phát triển Web (React)</h1>

      <h2>Nguyên tắc chung</h2>
      <ul>
        <li>Function component + hooks. Không dùng class component cho code mới.</li>
        <li>Mỗi file <code>pages/*.jsx</code> tương ứng 1 route, không nhét nhiều màn hình vào 1 file.</li>
        <li><code>components/</code> chỉ chứa component thuần UI, không tự gọi API trực tiếp - nhận dữ liệu qua props.</li>
        <li>Gọi API qua 1 lớp <code>api client</code> dùng chung (xem ví dụ bên dưới), không <code>fetch</code> rải rác trong component.</li>
      </ul>

      <h2>Ví dụ: gọi API (endpoint <code>/api/v1/projects</code>)</h2>
      <p>
        Ví dụ dưới đây dùng cho endpoint theo <em>quy ước REST bổ sung</em>{' '}
        của nhóm dev (envelope <code>data</code>/<code>error</code>) - xem{' '}
        <a href="#/api-standard">API Standard</a>. Với endpoint chính thức có
        multi-tenant/multi-channel (STD-API-SD-001 mục 5), client cần gửi
        thêm header <code>X-Channel-Id</code> khi ghi dữ liệu trên token
        nhiều channel; tenant/channel/scope thì do backend (Kong/BFF) chèn,
        frontend không tự gửi.
      </p>
      <pre className="code-block">{`// src/lib/apiClient.js
async function apiFetch(path, options = {}) {
  const res = await fetch(\`/api/v1\${path}\`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const body = await res.json();

  if (!res.ok) {
    // API Standard: lỗi luôn nằm trong body.error = { code, message, details }
    throw new Error(body.error?.message || 'Đã có lỗi xảy ra');
  }

  return body.data; // API Standard: dữ liệu thành công luôn nằm trong body.data
}

export function getProjects(page = 1, limit = 10) {
  return apiFetch(\`/projects?page=\${page}&limit=\${limit}\`);
}`}</pre>

      <h2>Component mẫu</h2>
      <pre className="code-block">{`import React, { useEffect, useState } from 'react';
import { getProjects } from '../lib/apiClient';

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProjects().then(setProjects).catch((err) => setError(err.message));
  }, []);

  if (error) return <p role="alert">{error}</p>;

  return (
    <ul>
      {projects.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}`}</pre>

      <h2>Routing</h2>
      <p>
        Dùng <code>react-router-dom</code>. Với site tĩnh phục vụ bởi Express như
        dự án mẫu này, ưu tiên <code>HashRouter</code> để không cần cấu hình
        catch-all route ở server; với SPA có server-side rendering hoặc reverse
        proxy riêng, dùng <code>BrowserRouter</code>.
      </p>

      <h2>State &amp; form</h2>
      <ul>
        <li>State cục bộ: <code>useState</code>/<code>useReducer</code>.</li>
        <li>State dùng chung nhiều màn hình: React Context, chỉ tách store riêng (Redux/Zustand) khi thật sự cần.</li>
        <li>Validate form phía client trước, nhưng server vẫn phải validate lại (không tin client).</li>
      </ul>

      <h2>Testing &amp; linting</h2>
      <ul>
        <li>ESLint + Prettier bắt buộc cho mọi PR.</li>
        <li>Ưu tiên test hành vi người dùng (React Testing Library) hơn test chi tiết implementation.</li>
      </ul>
    </article>
  );
}
