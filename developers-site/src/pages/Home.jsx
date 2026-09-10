import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function Home() {
  const { lang } = useLanguage();

  if (lang === 'en') {
    return (
      <article className="doc">
        <h1>developers.mmvietnam.com</h1>
        <p className="lead">
          Internal developer portal for MM Mega Market Vietnam (MMVN):
          guidance on how to build apps/web, and the{' '}
          <strong>API Standard</strong> (STD-API-SD-001 v1.1) - the mandatory
          standard for every MMVN API service.
        </p>

        <h2>Shared infrastructure &amp; platforms at MMVN</h2>
        <div className="cards">
          <div className="card">
            <h3>Service Discovery</h3>
            <p>Consul. Every service self-registers/deregisters and calls others via DNS name - no hard-coded IPs.</p>
          </div>
          <div className="card">
            <h3>Kong API Gateway</h3>
            <p>Mandatory entrypoint for every public and payment API; OAuth2 authentication, injects X-Authenticated-Scope.</p>
          </div>
          <div className="card">
            <h3>Kafka</h3>
            <p>Standard messaging for asynchronous communication between services, with topic/DLQ conventions.</p>
          </div>
          <div className="card">
            <h3>Prometheus + log-service</h3>
            <p>Every service exposes /metrics (internal) and ships centralized logs to log-service (Elasticsearch).</p>
          </div>
        </div>

        <h2>Supported backend languages</h2>
        <p>
          The API Standard doesn't lock you into a single language -
          Node.js, .NET, Python, and Java all have official libraries for
          OpenAPI docs and Prometheus metrics (see{' '}
          <a href="#/api-standard">API Standard</a> sections 10-11). The live
          example on this site uses <strong>Node.js + Express (CommonJS)</strong>;
          the frontend demo uses <strong>React</strong>.
        </p>

        <h2>Where to start?</h2>
        <ol>
          <li>
            Read <a href="#/bat-dau">Getting Started</a> to learn how to install and run the sample project.
          </li>
          <li>
            If you work on frontend, see the <a href="#/huong-dan-web">Web Guide</a>.
          </li>
          <li>
            If you work on backend/API, see the <a href="#/huong-dan-app">App/Backend Guide</a>{' '}
            and make sure to follow the <a href="#/api-standard">API Standard</a>.
          </li>
          <li>
            Before opening a pull request, review <a href="#/quy-uoc">Conventions & Code Style</a>.
          </li>
        </ol>

        <div className="callout">
          <strong>Note:</strong> The sections under <a href="#/api-standard">API
          Standard</a> are taken from the official STD-API-SD-001 v1.1 document
          (mandatory). The Web/App guides and the "Additional REST conventions"
          section are best practices proposed by the dev team for areas the
          official document doesn't cover - always prioritize STD-API-SD-001
          when there's a conflict.
        </div>
      </article>
    );
  }

  return (
    <article className="doc">
      <h1>developers.mmvietnam.com</h1>
      <p className="lead">
        Cổng thông tin dành cho developer nội bộ MM Mega Market Vietnam
        (MMVN): hướng dẫn cách phát triển app/web, và{' '}
        <strong>API Standard</strong> (STD-API-SD-001 v1.1) - chuẩn bắt buộc
        cho mọi API service của MMVN.
      </p>

      <h2>Hạ tầng &amp; nền tảng dùng chung của MMVN</h2>
      <div className="cards">
        <div className="card">
          <h3>Service Discovery</h3>
          <p>Consul. Mỗi service tự đăng ký/hủy đăng ký, gọi nhau qua DNS name - không hard-code IP.</p>
        </div>
        <div className="card">
          <h3>Kong API Gateway</h3>
          <p>Entrypoint bắt buộc cho mọi API public và payment; xác thực OAuth2, chèn X-Authenticated-Scope.</p>
        </div>
        <div className="card">
          <h3>Kafka</h3>
          <p>Messaging chuẩn cho giao tiếp bất đồng bộ giữa các service, kèm quy ước topic/DLQ.</p>
        </div>
        <div className="card">
          <h3>Prometheus + log-service</h3>
          <p>Mọi service expose /metrics (nội bộ) và đẩy log tập trung về log-service (Elasticsearch).</p>
        </div>
      </div>

      <h2>Ngôn ngữ backend được hỗ trợ</h2>
      <p>
        API Standard không ràng buộc một ngôn ngữ duy nhất - Node.js, .NET,
        Python và Java đều có thư viện chính thức tương ứng cho OpenAPI docs
        và Prometheus metrics (xem <a href="#/api-standard">API Standard</a>{' '}
        mục 10-11). Ví dụ sống trong site này dùng <strong>Node.js +
        Express (CommonJS)</strong>; frontend minh họa dùng <strong>React</strong>.
      </p>

      <h2>Bắt đầu từ đâu?</h2>
      <ol>
        <li>
          Đọc <a href="#/bat-dau">Bắt đầu</a> để biết cách cài đặt và chạy dự án mẫu.
        </li>
        <li>
          Nếu bạn làm frontend, xem <a href="#/huong-dan-web">Hướng dẫn Web</a>.
        </li>
        <li>
          Nếu bạn làm backend/API, xem <a href="#/huong-dan-app">Hướng dẫn App/Backend</a>{' '}
          và bắt buộc tuân theo <a href="#/api-standard">API Standard</a>.
        </li>
        <li>
          Trước khi mở pull request, kiểm tra lại <a href="#/quy-uoc">Quy ước & Code style</a>.
        </li>
      </ol>

      <div className="callout">
        <strong>Lưu ý:</strong> Các mục trong <a href="#/api-standard">API
        Standard</a> lấy từ tài liệu chính thức STD-API-SD-001 v1.1 (bắt
        buộc). Riêng hướng dẫn Web/App và phần "Quy ước REST bổ sung" là
        best-practice do nhóm dev đề xuất cho những phần tài liệu chính thức
        chưa quy định - luôn ưu tiên STD-API-SD-001 khi có xung đột.
      </div>
    </article>
  );
}
