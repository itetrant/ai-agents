import React from 'react';

export default function WebGuide() {
  return (
    <article className="doc">
      <h1>Huong dan phat trien Web (React)</h1>

      <h2>Nguyen tac chung</h2>
      <ul>
        <li>Function component + hooks. Khong dung class component cho code moi.</li>
        <li>Moi file <code>pages/*.jsx</code> tuong ung 1 route, khong nhet nhieu man hinh vao 1 file.</li>
        <li><code>components/</code> chi chua component thuan UI, khong tu goi API truc tiep - nhan du lieu qua props.</li>
        <li>Goi API qua 1 lop <code>api client</code> dung chung (xem vi du ben duoi), khong <code>fetch</code> rai rac trong component.</li>
      </ul>

      <h2>Vi du: goi API (endpoint <code>/api/v1/projects</code>)</h2>
      <p>
        Vi du duoi day dung cho endpoint theo <em>quy uoc REST bo sung</em>{' '}
        cua nhom dev (envelope <code>data</code>/<code>error</code>) - xem{' '}
        <a href="#/api-standard">API Standard</a>. Voi endpoint chinh thuc co
        multi-tenant/multi-channel (STD-API-SD-001 muc 5), client can gui
        them header <code>X-Channel-Id</code> khi ghi du lieu tren token
        nhieu channel; tenant/channel/scope thi do backend (Kong/BFF) chen,
        frontend khong tu gui.
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
    // API Standard: loi luon nam trong body.error = { code, message, details }
    throw new Error(body.error?.message || 'Da co loi xay ra');
  }

  return body.data; // API Standard: du lieu thanh cong luon nam trong body.data
}

export function getProjects(page = 1, limit = 10) {
  return apiFetch(\`/projects?page=\${page}&limit=\${limit}\`);
}`}</pre>

      <h2>Component mau</h2>
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
        Dung <code>react-router-dom</code>. Voi site tinh phuc vu boi Express nhu
        du an mau nay, uu tien <code>HashRouter</code> de khong can cau hinh
        catch-all route o server; voi SPA co server-side rendering hoac reverse
        proxy rieng, dung <code>BrowserRouter</code>.
      </p>

      <h2>State &amp; form</h2>
      <ul>
        <li>State cuc bo: <code>useState</code>/<code>useReducer</code>.</li>
        <li>State dung chung nhieu man hinh: React Context, chi tach store rieng (Redux/Zustand) khi that su can.</li>
        <li>Validate form phia client truoc, nhung server van phai validate lai (khong tin client).</li>
      </ul>

      <h2>Testing &amp; linting</h2>
      <ul>
        <li>ESLint + Prettier bat buoc cho moi PR.</li>
        <li>Uu tien test hanh vi nguoi dung (React Testing Library) hon test chi tiet implementation.</li>
      </ul>
    </article>
  );
}
