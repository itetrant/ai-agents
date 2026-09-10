import React from 'react';

export default function GettingStarted() {
  return (
    <article className="doc">
      <h1>Bat dau</h1>

      <h2>1. Yeu cau moi truong</h2>
      <ul>
        <li>Node.js &ge; 18 (LTS)</li>
        <li>npm &ge; 9</li>
        <li>Git</li>
      </ul>

      <h2>2. Cau truc thu muc chuan cho mot du an moi</h2>
      <pre className="code-block">{`ten-du-an/
  server/            # Node.js + Express (CommonJS)
    index.js          # entrypoint, khoi tao app, mount route
    routes/           # 1 file router cho moi resource
    middleware/        # auth, validate, error handler
    lib/                # helper dung chung (envelope, logger, ...)
  src/                # React app
    index.js            # ReactDOM.createRoot(...)
    App.jsx              # routing
    components/           # component dung chung, khong gan logic nghiep vu
    pages/                 # 1 file = 1 man hinh/route
  public/             # index.html + bundle build ra
  package.json
  webpack.config.js
  .babelrc`}</pre>

      <h2>3. Cai dat</h2>
      <pre className="code-block">{`npm install`}</pre>

      <h2>4. Chay dev (frontend watch + backend cung luc)</h2>
      <pre className="code-block">{`npm run dev`}</pre>
      <p>
        Lenh nay chay song song <code>webpack --watch</code> (build lai
        <code> public/bundle.js</code> moi khi sua code React) va{' '}
        <code>node server/index.js</code> (Express phuc vu ca trang web lan API).
      </p>

      <h2>5. Build production</h2>
      <pre className="code-block">{`npm run build   # webpack --mode production -> public/bundle.js
npm run server  # node server/index.js`}</pre>

      <div className="callout">
        Server mac dinh chay o <code>http://localhost:4000</code>. Doi port bang
        bien moi truong <code>PORT</code>.
      </div>
    </article>
  );
}
