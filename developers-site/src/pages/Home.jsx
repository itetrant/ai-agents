import React from 'react';

export default function Home() {
  return (
    <article className="doc">
      <h1>developers.mmvietnam.com</h1>
      <p className="lead">
        Cong thong tin danh cho developer noi bo MM Mega Market Vietnam
        (MMVN): huong dan cach phat trien app/web, va{' '}
        <strong>API Standard</strong> (STD-API-SD-001 v1.1) - chuan bat buoc
        cho moi API service cua MMVN.
      </p>

      <h2>Ha tang &amp; nen tang dung chung cua MMVN</h2>
      <div className="cards">
        <div className="card">
          <h3>Service Discovery</h3>
          <p>Consul. Moi service tu dang ky/huy dang ky, goi nhau qua DNS name - khong hard-code IP.</p>
        </div>
        <div className="card">
          <h3>Kong API Gateway</h3>
          <p>Entrypoint bat buoc cho moi API public va payment; xac thuc OAuth2, chen X-Authenticated-Scope.</p>
        </div>
        <div className="card">
          <h3>Kafka</h3>
          <p>Messaging chuan cho giao tiep bat dong bo giua cac service, kem quy uoc topic/DLQ.</p>
        </div>
        <div className="card">
          <h3>Prometheus + log-service</h3>
          <p>Moi service expose /metrics (noi bo) va day log tap trung ve log-service (Elasticsearch).</p>
        </div>
      </div>

      <h2>Ngon ngu backend duoc ho tro</h2>
      <p>
        API Standard khong rang buoc mot ngon ngu duy nhat - Node.js, .NET,
        Python va Java deu co thu vien chinh thuc tuong ung cho OpenAPI docs
        va Prometheus metrics (xem <a href="#/api-standard">API Standard</a>{' '}
        muc 10-11). Vi du song trong site nay dung <strong>Node.js +
        Express (CommonJS)</strong>; frontend minh hoa dung <strong>React</strong>.
      </p>

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
        <strong>Luu y:</strong> Cac muc trong <a href="#/api-standard">API
        Standard</a> lay tu tai lieu chinh thuc STD-API-SD-001 v1.1 (bat
        buoc). Rieng huong dan Web/App va phan "Quy uoc REST bo sung" la
        best-practice do nhom dev de xuat cho nhung phan tai lieu chinh thuc
        chua quy dinh - luon uu tien STD-API-SD-001 khi co xung dot.
      </div>
    </article>
  );
}
