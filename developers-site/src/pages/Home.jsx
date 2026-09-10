import React from 'react';

export default function Home() {
  return (
    <article className="doc">
      <h1>developers.mmvietnam.com</h1>
      <p className="lead">
        Cong thong tin danh cho developer noi bo mmvietnam: huong dan cach phat
        trien app/web, va bo <strong>chuan API (API Standard)</strong> dung
        chung cho moi service.
      </p>

      <h2>Stack ky thuat de xuat</h2>
      <div className="cards">
        <div className="card">
          <h3>Backend</h3>
          <p>Node.js + Express, module CommonJS (require/module.exports).</p>
        </div>
        <div className="card">
          <h3>Frontend</h3>
          <p>React (function component + hooks), react-router-dom cho routing.</p>
        </div>
        <div className="card">
          <h3>Giao tiep du lieu</h3>
          <p>REST JSON theo API Standard, versioning qua path (/api/v1/...).</p>
        </div>
        <div className="card">
          <h3>Build tooling</h3>
          <p>Webpack + Babel cho frontend, Node chay truc tiep cho server.</p>
        </div>
      </div>

      <h2>Bat dau tu dau?</h2>
      <ol>
        <li>
          Doc <a href="#/bat-dau">Bat dau</a> de biet cach cai dat va chay du an mau.
        </li>
        <li>
          Neu ban lam frontend, xem <a href="#/huong-dan-web">Huong dan Web</a>.
        </li>
        <li>
          Neu ban lam backend/API, xem <a href="#/huong-dan-app">Huong dan App/Backend</a>{' '}
          va bat buoc tuan theo <a href="#/api-standard">API Standard</a>.
        </li>
        <li>
          Truoc khi mo pull request, kiem tra lai <a href="#/quy-uoc">Quy uoc & Code style</a>.
        </li>
      </ol>

      <div className="callout">
        <strong>Luu y:</strong> Day la tai lieu best-practice noi bo, ap dung cho
        moi du an moi cua mmvietnam tru khi du an co quy dinh rieng thay the.
      </div>
    </article>
  );
}
