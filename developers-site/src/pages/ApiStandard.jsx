import React from 'react';

export default function ApiStandard() {
  return (
    <article className="doc">
      <h1>API Standard (v1)</h1>
      <p className="lead">
        Chuan REST API ap dung cho moi backend cua mmvietnam. Vi du song
        (live) minh hoa chuan nay dang chay ngay tren site nay tai{' '}
        <code>/api/v1/*</code>.
      </p>

      <h2>1. Versioning</h2>
      <p>
        Version nam tren URL path: <code>/api/v1/...</code>. Khi co breaking
        change (doi cau truc response, doi ten field, doi hanh vi), tang len{' '}
        <code>v2</code> thay vi sua truc tiep <code>v1</code>.
      </p>

      <h2>2. Dinh dang response - "envelope"</h2>
      <p>Thanh cong:</p>
      <pre className="code-block">{`{
  "data": { "id": "1", "name": "Website ban hang" },
  "meta": { "pagination": { "page": 1, "limit": 10, "total": 2, "totalPages": 1 } }
}`}</pre>
      <p><code>meta</code> la tuy chon, chi xuat hien khi can (vd. phan trang).</p>

      <p>That bai:</p>
      <pre className="code-block">{`{
  "error": {
    "code": "validation_error",
    "message": "Truong \\"name\\" la bat buoc.",
    "details": { "fields": { "name": "required" } }
  }
}`}</pre>
      <p>
        <code>details</code> la tuy chon. <code>code</code> la ma loi on dinh,
        client duoc phep dua vao <code>code</code> de xu ly logic (khong dua
        vao <code>message</code> vi message co the doi ngon ngu).
      </p>

      <h2>3. HTTP status code</h2>
      <table className="table">
        <thead>
          <tr><th>Status</th><th>Y nghia</th></tr>
        </thead>
        <tbody>
          <tr><td>200 OK</td><td>Thanh cong, co body</td></tr>
          <tr><td>201 Created</td><td>Tao moi thanh cong, body la resource vua tao</td></tr>
          <tr><td>204 No Content</td><td>Thanh cong, khong co body (vd. sau khi xoa)</td></tr>
          <tr><td>401 Unauthorized</td><td>Thieu/sai thong tin xac thuc</td></tr>
          <tr><td>403 Forbidden</td><td>Da xac thuc nhung khong co quyen</td></tr>
          <tr><td>404 Not Found</td><td>Khong tim thay resource hoac endpoint</td></tr>
          <tr><td>422 Unprocessable Entity</td><td>Loi validate du lieu dau vao</td></tr>
          <tr><td>500 Internal Server Error</td><td>Loi khong luong truoc phia server</td></tr>
        </tbody>
      </table>

      <h2>4. Phan trang</h2>
      <p>
        Query param <code>page</code> (mac dinh 1) va <code>limit</code> (mac
        dinh 10, toi da 50). Ket qua tra ve trong <code>meta.pagination</code>.
      </p>
      <pre className="code-block">{`GET /api/v1/projects?page=2&limit=20`}</pre>

      <h2>5. Xac thuc (Authentication)</h2>
      <p>
        Bearer token trong header <code>Authorization</code>:
      </p>
      <pre className="code-block">{`Authorization: Bearer <token>`}</pre>
      <p>Thieu hoac sai token → 401 voi <code>code: "unauthorized"</code> hoac <code>"invalid_token"</code>.</p>

      <h2>6. Idempotency cho request ghi du lieu</h2>
      <p>
        Voi <code>POST</code> co the bi goi lai (vd. do retry mang), client nen
        gui header <code>Idempotency-Key</code> (UUID do client sinh ra). Server
        luu ket qua theo key nay va tra ve cung 1 ket qua neu nhan lai cung key,
        thay vi tao ban ghi trung lap.
      </p>

      <h2>7. Dat ten resource &amp; endpoint</h2>
      <ul>
        <li>Danh tu so nhieu, khong dong tu: <code>/projects</code> chu khong phai <code>/getProjects</code>.</li>
        <li>Long resource qua quan he cha-con toi da 1 cap: <code>/projects/:id/tasks</code>.</li>
        <li>Dung dung HTTP method: GET (doc), POST (tao), PATCH (cap nhat mot phan), PUT (thay the toan bo), DELETE (xoa).</li>
      </ul>

      <h2>8. Vi du day du (chay that tren site nay)</h2>
      <pre className="code-block">{`curl http://localhost:4000/api/v1/projects

curl -X POST http://localhost:4000/api/v1/projects \\
  -H "Authorization: Bearer demo-token" \\
  -H "Content-Type: application/json" \\
  -H "Idempotency-Key: $(uuidgen)" \\
  -d '{"name": "App CSKH", "stack": "React Native"}'`}</pre>

      <div className="callout">
        Code nguon vi du (envelope, middleware auth, router) nam trong{' '}
        <code>developers-site/server/</code> cua repo nay - dung lam khuon mau
        khi tao service moi.
      </div>
    </article>
  );
}
