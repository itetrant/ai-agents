import React from 'react';

export default function GettingStarted() {
  return (
    <article className="doc">
      <h1>Bắt đầu</h1>

      <h2>1. Yêu cầu môi trường</h2>
      <ul>
        <li>Node.js &ge; 18 (LTS)</li>
        <li>npm &ge; 9</li>
        <li>Git</li>
      </ul>

      <h2>2. Cấu trúc thư mục chuẩn cho một dự án mới</h2>
      <pre className="code-block">{`ten-du-an/
  server/            # Node.js + Express (CommonJS)
    index.js          # entrypoint, khởi tạo app, mount route
    routes/           # 1 file router cho mỗi resource
    middleware/        # auth, validate, error handler
    lib/                # helper dùng chung (envelope, logger, ...)
  src/                # React app
    index.js            # ReactDOM.createRoot(...)
    App.jsx              # routing
    components/           # component dùng chung, không gắn logic nghiệp vụ
    pages/                 # 1 file = 1 màn hình/route
  public/             # index.html + bundle build ra
  package.json
  webpack.config.js
  .babelrc`}</pre>

      <h2>3. Cài đặt</h2>
      <pre className="code-block">{`npm install`}</pre>

      <h2>4. Chạy dev (frontend watch + backend cùng lúc)</h2>
      <pre className="code-block">{`npm run dev`}</pre>
      <p>
        Lệnh này chạy song song <code>webpack --watch</code> (build lại
        <code> public/bundle.js</code> mỗi khi sửa code React) và{' '}
        <code>node server/index.js</code> (Express phục vụ cả trang web lẫn API).
      </p>

      <h2>5. Build production</h2>
      <pre className="code-block">{`npm run build   # webpack --mode production -> public/bundle.js
npm run server  # node server/index.js`}</pre>

      <div className="callout">
        Server mặc định chạy ở <code>http://localhost:4000</code>. Đổi port bằng
        biến môi trường <code>PORT</code>.
      </div>
    </article>
  );
}
