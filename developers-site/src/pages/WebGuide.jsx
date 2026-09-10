import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function WebGuide() {
  const { lang } = useLanguage();

  if (lang === 'en') {
    return (
      <article className="doc">
        <h1>Web Development Guide (React)</h1>

        <h2>General principles</h2>
        <ul>
          <li>Function components + hooks. Don't use class components for new code.</li>
          <li>Each <code>pages/*.jsx</code> file maps to one route - don't cram multiple screens into a single file.</li>
          <li><code>components/</code> only contains pure UI components that don't call the API directly - they receive data via props.</li>
          <li>Call the API through a shared <code>api client</code> layer (see example below), not scattered <code>fetch</code> calls inside components.</li>
        </ul>

        <h2>Example: calling the API (endpoint <code>/api/v1/projects</code>)</h2>
        <p>
          The example below is for an endpoint following the dev team's{' '}
          <em>additional REST convention</em> (<code>data</code>/<code>error</code>{' '}
          envelope) - see <a href="#/api-standard">API Standard</a>. For
          official endpoints with multi-tenant/multi-channel support
          (STD-API-SD-001 section 5), the client must also send an{' '}
          <code>X-Channel-Id</code> header when writing data on a token with
          multiple channels; tenant/channel/scope are injected by the backend
          (Kong/BFF) - the frontend never sends them itself.
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
    // API Standard: errors always live in body.error = { code, message, details }
    throw new Error(body.error?.message || 'Something went wrong');
  }

  return body.data; // API Standard: successful data always lives in body.data
}

export function getProjects(page = 1, limit = 10) {
  return apiFetch(\`/projects?page=\${page}&limit=\${limit}\`);
}`}</pre>

        <h2>Sample component</h2>
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
          Uses <code>react-router-dom</code>. For a static site served by
          Express like this sample project, prefer <code>HashRouter</code>{' '}
          so you don't need to configure a catch-all route on the server;
          for an SPA with server-side rendering or its own reverse proxy,
          use <code>BrowserRouter</code>.
        </p>

        <h2>State &amp; forms</h2>
        <ul>
          <li>Local state: <code>useState</code>/<code>useReducer</code>.</li>
          <li>State shared across multiple screens: React Context - only split off a separate store (Redux/Zustand) when truly necessary.</li>
          <li>Validate forms on the client first, but the server must always validate again (never trust the client).</li>
        </ul>

        <h2>Testing &amp; linting</h2>
        <ul>
          <li>ESLint + Prettier are mandatory for every PR.</li>
          <li>Prefer testing user behavior (React Testing Library) over testing implementation details.</li>
        </ul>
      </article>
    );
  }

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
