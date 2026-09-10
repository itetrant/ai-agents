import React from 'react';

export default function ApiStandard() {
  return (
    <article className="doc">
      <h1>API Standard</h1>
      <p className="lead">
        Chuan chinh thuc, bat buoc ap dung cho moi API service cua MM Mega
        Market Vietnam (MMVN). Trang nay trinh bay lai noi dung tai lieu goc
        de tra cuu nhanh khi code - ban PDF/Word chinh thuc van la nguon tham
        chieu phap ly khi co tranh chap.
      </p>

      <table className="table">
        <tbody>
          <tr><th>Ma tai lieu</th><td>STD-API-SD-001</td></tr>
          <tr><th>Phien ban</th><td>01 (chinh sua 1) - v1.1</td></tr>
          <tr><th>Ngay hieu luc</th><td>22/07/2026</td></tr>
          <tr><th>Ten quy dinh</th><td>Tieu chuan dang ky &amp; truy cap API Service qua Service Discovery</td></tr>
          <tr><th>Pham vi ap dung</th><td>Tat ca API services cua MMVN</td></tr>
          <tr><th>Doi tuong</th><td>Dev team, Infra/DevOps, Architect, doi tac phat trien</td></tr>
          <tr><th>Trang thai</th><td><strong>Bat buoc (Mandatory)</strong></td></tr>
        </tbody>
      </table>

      <div className="callout">
        Hai endpoint <code>/api/v1/orders</code> va <code>/metrics</code>{' '}
        cua site nay la <strong>vi du song thuc thi dung</strong> muc 5 va muc
        11 cua chuan nay (code trong <code>developers-site/server/</code>) -
        khong chi la mo ta, ban co the goi thu ngay.
      </div>

      <h2>1. Muc dich</h2>
      <p>
        Chuan hoa cach cac API service dang ky va duoc phat hien (discover)
        trong he thong MMVN. Loai bo viec hard-code dia chi IP tinh, cho phep
        mo rong, failover va can bang tai ma khong can thay doi cau hinh ung
        dung.
      </p>

      <h2>2. Nguyen tac bat buoc</h2>
      <ul>
        <li>Moi API service <strong>PHAI</strong> tu dang ky len Service Discovery ngay khi khoi dong (self-registration).</li>
        <li>Ung dung consumer <strong>PHAI</strong> truy van Service Discovery de lay dia chi (DNS name) cua service dich truoc khi goi.</li>
        <li>Moi ket noi giua cac service <strong>PHAI</strong> dung DNS name - <strong>NGHIEM CAM</strong> hard-code dia chi IP.</li>
        <li>Service <strong>PHAI</strong> cung cap health check endpoint de Service Discovery loai bo instance loi.</li>
        <li>Service <strong>PHAI</strong> huy dang ky (deregister) khi shutdown mot cach chu dong (graceful).</li>
        <li>Payment service va moi API service public <strong>PHAI</strong> duoc truy cap thong qua Kong API Gateway - <strong>NGHIEM CAM</strong> client ben ngoai goi truc tiep vao service.</li>
        <li>Moi API service <strong>PHAI</strong> expose tai lieu OpenAPI tai <code>/api-docs</code> va metrics tai <code>/metrics</code>.</li>
        <li>Moi API service <strong>PHAI</strong> ho tro multi-tenant va multi-channel: xac dinh <code>tenant_id</code>, <code>channel_id</code> va scope tu ngu canh OAuth2 da xac thuc, co lap du lieu theo ca hai.</li>
      </ul>

      <h2>3. Kien truc luong</h2>
      <ol>
        <li>API Service khoi dong &rarr; tu dang ky (ten service, DNS name, port, health endpoint) len Service Discovery.</li>
        <li>Service Discovery lien tuc kiem tra health; chi giu lai cac instance khoe manh.</li>
        <li>Consumer App truy van Service Discovery bang ten logic cua service.</li>
        <li>Service Discovery tra ve DNS name cua (cac) instance kha dung.</li>
        <li>Consumer goi API service qua DNS name da nhan.</li>
      </ol>

      <h2>4. Naming Rule (Quy tac dat ten)</h2>
      <p>
        MMVN ap dung mo hinh <strong>functional naming</strong>: ten service
        phan anh chuc nang nghiep vu, khong phan anh cong nghe, ten team, ten
        server hay co cau to chuc. Nho do ten service giu nguyen khi thay doi
        cong nghe hoac tai cau truc phong ban.
      </p>

      <h3>4.1 Cau truc ten service</h3>
      <pre className="code-block">{`<functional-name>      ::= <functional-domain>-<functional-component>
<functional-domain>    ::= [a-z][a-z0-9-]*    // nhom nghiep vu
<functional-component> ::= [a-z][a-z0-9-]*    // chuc nang cu the`}</pre>
      <p>Chi dung chu thuong, phan cach bang dau gach ngang (<code>-</code>), khong dung underscore, dau cach, chu hoa hay ky tu tieng Viet co dau. Do dai khuyen nghi toi da 30 ky tu.</p>

      <h3>4.2 Danh muc functional-domain</h3>
      <table className="table">
        <thead><tr><th>Domain</th><th>Pham vi nghiep vu</th><th>Vi du service name</th></tr></thead>
        <tbody>
          <tr><td>payment</td><td>Thanh toan, hoan tien, doi soat</td><td>payment-charge, payment-refund</td></tr>
          <tr><td>order</td><td>Don hang, gio hang</td><td>order-management, order-fulfillment</td></tr>
          <tr><td>customer</td><td>Khach hang, MCard loyalty</td><td>customer-profile, customer-loyalty</td></tr>
          <tr><td>product</td><td>San pham, SKU, category</td><td>product-catalog, product-pricing</td></tr>
          <tr><td>inventory</td><td>Ton kho, kho van</td><td>inventory-stock, inventory-transfer</td></tr>
          <tr><td>store</td><td>Cua hang, POS, trung tam</td><td>store-master, store-pos</td></tr>
          <tr><td>erp</td><td>Tich hop Oracle EBS</td><td>erp-gateway, erp-sync</td></tr>
          <tr><td>platform</td><td>Dich vu nen tang dung chung</td><td>platform-log, platform-notification</td></tr>
        </tbody>
      </table>

      <h3>4.3 Quy tac dat ten DNS</h3>
      <table className="table">
        <thead><tr><th>Loai</th><th>Dinh dang</th><th>Vi du</th></tr></thead>
        <tbody>
          <tr><td>Noi bo PROD</td><td><code>{'<functional-name>.mmvietnam.vn'}</code></td><td>payment-charge.mmvietnam.vn</td></tr>
          <tr><td>Noi bo UAT</td><td><code>{'<functional-name>-uat.mmvietnam.vn'}</code></td><td>payment-charge-uat.mmvietnam.vn</td></tr>
          <tr><td>Public PROD</td><td><code>{'api.mmvietnam.vn/<domain>/<version>'}</code></td><td>api.mmvietnam.vn/payment/v1</td></tr>
          <tr><td>Public UAT</td><td><code>{'api-uat.mmvietnam.vn/<domain>/<version>'}</code></td><td>api-uat.mmvietnam.vn/payment/v1</td></tr>
        </tbody>
      </table>

      <h3>4.4 Service ID va Tags</h3>
      <table className="table">
        <thead><tr><th>Thanh phan</th><th>Dinh dang</th><th>Vi du</th></tr></thead>
        <tbody>
          <tr><td>Service Name</td><td><code>{'<functional-name>'}</code></td><td>payment-charge</td></tr>
          <tr><td>Service ID</td><td><code>{'<name>-<address>-<port>'}</code></td><td>payment-charge-172.26.16.109-8080</td></tr>
          <tr><td>Tag moi truong</td><td>PROD | UAT | DEV</td><td>UAT</td></tr>
          <tr><td>Tag version</td><td><code>{'v<MAJOR>.<MINOR>.<PATCH>'}</code></td><td>v7.15.1</td></tr>
        </tbody>
      </table>

      <h3>4.5 Quy tac dat ten REST resource path</h3>
      <ul>
        <li>Path segment dung chu thuong, phan cach bang dau gach ngang: <code>/purchase-orders</code> (KHONG dung <code>/purchaseOrders</code> hay <code>/purchase_orders</code>).</li>
        <li>Ten resource dung danh tu so nhieu: <code>/orders</code>, <code>/customers</code>, <code>/products</code> - khong dung dong tu.</li>
        <li>Version bat buoc nam ngay sau functional-domain: <code>/payment/v1/charges</code>.</li>
        <li>Ten thuoc tinh trong JSON body dung <strong>snake_case</strong>: <code>created_at</code>, <code>order_id</code>, <code>total_amount</code>.</li>
        <li>Truong ngay gio ket thuc bang hau to <code>_at</code> hoac chua tu chi loai: <code>created_at</code>, <code>arrival_date</code>.</li>
      </ul>

      <h3>4.6 Bang doi chieu Dung / Sai</h3>
      <table className="table">
        <thead><tr><th>DUNG</th><th>SAI</th></tr></thead>
        <tbody>
          <tr><td>payment-charge</td><td>PaymentCharge, payment_charge</td></tr>
          <tr><td>customer-loyalty</td><td>mcard-nodejs-svc (lo cong nghe)</td></tr>
          <tr><td>inventory-stock</td><td>team-infra-api (theo to chuc)</td></tr>
          <tr><td>order-management.mmvietnam.vn</td><td>172.26.16.109:8080 (hard-code IP)</td></tr>
          <tr><td>/payment/v1/charges</td><td>/payment/getCharge (dung dong tu)</td></tr>
        </tbody>
      </table>

      <h3>4.7 Dang ky ten</h3>
      <p>Moi <code>functional-name</code> <strong>PHAI</strong> duoc dang ky va phe duyet voi Architect/Infra truoc khi trien khai, nham dam bao tinh duy nhat tren toan he thong va tranh trung lap giua cac team.</p>

      <h2>5. Nguyen tac ho tro Multi-Tenant</h2>
      <p>
        MMVN van hanh nhieu phap nhan (entity/company) tren cung mot nen
        tang. Moi phap nhan la mot tenant. Moi API service <strong>PHAI</strong>{' '}
        duoc thiet ke multi-tenant ngay tu dau - viec bo sung sau khi he
        thong da chay gan nhu luon dan toi ro ri du lieu cheo giua cac phap
        nhan.
      </p>

      <h3>5.1 Mo hinh co lap du lieu</h3>
      <p>MMVN ap dung mo hinh <strong>shared database</strong> - cac tenant dung chung database va schema, phan biet bang cot <code>tenant_id</code> va <code>channel_id</code> tren moi bang chua du lieu nghiep vu.</p>
      <table className="table">
        <thead><tr><th>Hang muc</th><th>Quy dinh bat buoc</th></tr></thead>
        <tbody>
          <tr><td>Cot dinh danh</td><td>Moi bang nghiep vu PHAI co cot <code>tenant_id</code> va <code>channel_id</code>, NOT NULL, khong co gia tri mac dinh</td></tr>
          <tr><td>Index</td><td><code>tenant_id</code> PHAI la cot dau tien cua index chinh, tiep theo la <code>channel_id</code></td></tr>
          <tr><td>Khoa ngoai</td><td>Quan he giua cac bang PHAI kiem tra cung <code>tenant_id</code> va <code>channel_id</code>, tranh tham chieu cheo</td></tr>
          <tr><td>Rang buoc duy nhat</td><td>Unique constraint PHAI bao gom <code>tenant_id</code> va <code>channel_id</code> (vd: <code>UNIQUE(tenant_id, channel_id, order_code)</code>), khong unique toan cuc</td></tr>
        </tbody>
      </table>
      <p>Chi mot cau truy van thieu dieu kien tenant la du lieu cua phap nhan nay lo sang phap nhan khac - vi vay cac quy dinh o duoi la bat buoc tuyet doi.</p>

      <h3>5.2 Xac thuc OAuth2 va truyen ngu canh</h3>
      <p>MMVN dung OAuth2 lam chuan xac thuc duy nhat, hai luong:</p>
      <table className="table">
        <thead><tr><th>Luong</th><th>Co che xac thuc</th><th>Nguon ngu canh</th></tr></thead>
        <tbody>
          <tr><td>External (qua Kong)</td><td>Kong OAuth2 plugin validate token tai gateway</td><td>Header do Kong chen sau khi validate</td></tr>
          <tr><td>Service-to-service</td><td><code>x-api-key</code>, service tu validate</td><td>Claim trong JWT</td></tr>
        </tbody>
      </table>

      <p><strong>Token endpoint:</strong></p>
      <table className="table">
        <thead><tr><th>Moi truong</th><th>Token endpoint</th></tr></thead>
        <tbody>
          <tr><td>PROD</td><td><code>https://api.mmvietnam.vn/auth/{'{service-name}'}/oauth2/token</code></td></tr>
          <tr><td>UAT</td><td><code>https://api-uat.mmvietnam.vn/auth/{'{service-name}'}/oauth2/token</code></td></tr>
        </tbody>
      </table>

      <p>
        <strong>Trust model - network-based:</strong> moi request trong mang
        noi bo duoc coi la den tu nguon tin cay. Sau khi xac thuc, ca hai
        luong deu chen header <code>X-Authenticated-Scope</code> (boi Kong o
        luong external, boi chinh service o luong service-to-service).
      </p>

      <h3>5.2.3 Cau truc Scope</h3>
      <p>Scope mang ca pham vi du lieu lan quyen thao tac, la danh sach phang phan cach boi dau cach:</p>
      <table className="table">
        <thead><tr><th>Loai</th><th>Cu phap</th><th>Y nghia</th></tr></thead>
        <tbody>
          <tr><td>Pham vi tenant</td><td><code>tenant:{'<ma>'}</code></td><td>Phap nhan duoc phep truy cap</td></tr>
          <tr><td>Pham vi channel</td><td><code>channel:{'<so>'}</code></td><td>Kenh ban duoc phep, co the xuat hien nhieu lan</td></tr>
          <tr><td>Quyen</td><td><code>{'<domain>.<action>'}</code></td><td>Thao tac duoc phep: read, write, delete, admin</td></tr>
        </tbody>
      </table>
      <pre className="code-block">{`X-Authenticated-Scope: tenant:12 channel:3 channel:4 order.read order.write inventory.read`}</pre>

      <h3>5.2.4 Quy tac ap dung Scope</h3>
      <ul>
        <li>Token PHAI chua dung MOT muc <code>tenant:</code>. Nhieu tenant hoac khong co tenant &rarr; <strong>401 Unauthorized</strong>.</li>
        <li>Token PHAI chua it nhat MOT muc <code>channel:</code>.</li>
        <li>Quyen trong scope ap dung cho TAT CA channel co trong token. Can phan quyen khac nhau theo tung kenh &rarr; cap token rieng cho tung kenh.</li>
        <li>Service PHAI kiem tra scope TRUOC khi xu ly nghiep vu, theo thu tu: (1) trich tenant, (2) trich danh sach channel, (3) kiem tra quyen cua endpoint.</li>
        <li>Thieu quyen &rarr; <strong>403 Forbidden</strong> (khac voi thieu xac thuc = 401).</li>
        <li>Cap scope theo nguyen tac toi thieu - KHONG cap admin cho tich hop chi can doc.</li>
        <li><strong>NGHIEM CAM</strong> lay scope, tenant_id hay channel_id tu query string, request body hay path do client gui - ngu canh chi den tu <code>req.ctx</code> da xac thuc.</li>
        <li><strong>NGHIEM CAM</strong> cho phep client chi dinh <code>tenant_id</code>/<code>channel_id</code> trong payload khi tao/cap nhat; service PHAI tu gan tu <code>req.ctx</code> va bo qua gia tri client gui.</li>
      </ul>

      <h3>5.2.5 Xac dinh channel dang thao tac</h3>
      <table className="table">
        <thead><tr><th>Loai thao tac</th><th>Cach xac dinh channel</th></tr></thead>
        <tbody>
          <tr><td>Ghi (POST/PUT/PATCH/DELETE)</td><td>Request PHAI chi dinh channel qua header <code>X-Channel-Id</code>, phai nam trong scope; sai &rarr; 403, thieu khi token co nhieu channel &rarr; 400.</td></tr>
          <tr><td>Doc mot ban ghi</td><td>Loc theo toan bo danh sach channel trong scope.</td></tr>
          <tr><td>Doc danh sach</td><td>Mac dinh tra ve du lieu cua MOI channel trong scope; client co the thu hep nhung van phai nam trong scope.</td></tr>
        </tbody>
      </table>
      <p><code>X-Channel-Id</code> chi dung de CHON trong pham vi da duoc cap, KHONG BAO GIO dung de mo rong pham vi.</p>

      <h3>5.2.6 Danh muc Sale Channel</h3>
      <table className="table">
        <thead><tr><th>channel_id</th><th>Sale Channel</th><th>Mo ta</th></tr></thead>
        <tbody>
          <tr><td>0</td><td>Cash &amp; Carry</td><td>Kenh ban le tai trung tam</td></tr>
          <tr><td>1</td><td>CCOD</td><td>Credit &amp; Cash On Delivery</td></tr>
          <tr><td>2</td><td>B2B</td><td>Kenh khach hang doanh nghiep</td></tr>
          <tr><td>3</td><td>Click &amp; Get</td><td>Dat truc tuyen, https://online.mmvietnam.com</td></tr>
          <tr><td>4</td><td>Market Place</td><td>Kenh san thuong mai dien tu</td></tr>
          <tr><td>5</td><td>Telesale</td><td>Kenh ban qua dien thoai</td></tr>
          <tr><td>6</td><td>Online BSM</td><td>Kenh truc tuyen Bs'Mart (closed)</td></tr>
          <tr><td>7</td><td>GiaTot</td><td>Kenh Gia Tot</td></tr>
        </tbody>
      </table>
      <ul>
        <li>Danh muc <code>channel_id</code> PHAI duoc dang ky va phe duyet tap trung boi Architect, giong <code>functional-name</code>.</li>
        <li>KHONG tai su dung ma cua kenh da ngung hoat dong cho kenh moi.</li>
        <li><code>channel_id = 0</code> la gia tri hop le (Cash &amp; Carry) - khi kiem tra su ton tai, PHAI dung kiem tra null/undefined, KHONG dung phep kiem tra truthy.</li>
      </ul>

      <h3>5.3 - 5.4 Multi-Tenant trong Log va Kafka</h3>
      <ul>
        <li>Log: moi ban ghi log PHAI co <code>tenant_id</code> va <code>channel_id</code> (xem muc Logging).</li>
        <li>Kafka: topic dung CHUNG cho moi tenant/channel; <code>tenant_id</code>/<code>channel_id</code> nam trong envelope message; message key nen la <code>{'<tenant_id>:<channel_id>:<entity_id>'}</code>; consumer thieu cac truong nay PHAI day sang DLQ, khong dung gia tri mac dinh.</li>
      </ul>

      <h3>5.5 Kiem thu bat buoc truoc Production</h3>
      <table className="table">
        <thead><tr><th>Kich ban</th><th>Ket qua mong doi</th></tr></thead>
        <tbody>
          <tr><td>Doc ban ghi cua tenant khac bang ID hop le</td><td>404 Not Found</td></tr>
          <tr><td>Doc ban ghi cua channel ngoai scope</td><td>404 Not Found</td></tr>
          <tr><td>Cap nhat/xoa ban ghi ngoai pham vi</td><td>404 Not Found, du lieu khong doi</td></tr>
          <tr><td>Gui tenant_id / channel_id gia trong body</td><td>Bi bo qua, dung gia tri tu scope</td></tr>
          <tr><td>Client external tu gui X-Authenticated-Scope</td><td>Kong strip header, service khong tin gia tri client</td></tr>
          <tr><td>Goi truc tiep service kem X-Authenticated-Scope gia</td><td>Service strip header, tra 401 neu khong co x-api-key hop le</td></tr>
          <tr><td>x-api-key sai/da thu hoi</td><td>401 Unauthorized</td></tr>
          <tr><td>Scope thieu tenant: hoac channel:</td><td>401 Unauthorized</td></tr>
          <tr><td>Goi endpoint ghi chi voi quyen read</td><td>403 Forbidden</td></tr>
          <tr><td>Gui X-Channel-Id ngoai scope</td><td>403 Forbidden</td></tr>
          <tr><td>Thieu X-Channel-Id khi token co nhieu channel (ghi)</td><td>400 Bad Request</td></tr>
          <tr><td>Liet ke danh sach ban ghi</td><td>Chi tra ve du lieu thuoc tenant va cac channel trong scope</td></tr>
        </tbody>
      </table>
      <div className="callout">
        Bo test tren duoc thuc thi day du boi <code>/api/v1/orders</code> cua
        site nay - xem <code>server/routes/orders.js</code> va{' '}
        <code>server/middleware/scopeContext.js</code>.
      </div>

      <h2>6. Endpoint Service Discovery</h2>
      <table className="table">
        <thead><tr><th>Moi truong</th><th>URL Service Discovery</th></tr></thead>
        <tbody>
          <tr><td>PROD</td><td><code>http://discovery.mmvietnam.vn</code></td></tr>
          <tr><td>UAT</td><td><code>http://discovery-uat.mmvietnam.vn</code></td></tr>
        </tbody>
      </table>

      <h2>7. Kong API Gateway</h2>
      <p>Payment service va tat ca API service public BAT BUOC di qua Kong. Client ben ngoai chi goi toi domain gateway; Service Discovery va DNS name noi bo chi dung cho giao tiep service-to-service.</p>
      <table className="table">
        <thead><tr><th>Moi truong</th><th>Kong API Gateway</th></tr></thead>
        <tbody>
          <tr><td>PROD</td><td><code>https://api.mmvietnam.vn</code></td></tr>
          <tr><td>UAT</td><td><code>https://api-uat.mmvietnam.vn</code></td></tr>
        </tbody>
      </table>

      <h2>8. Yeu cau dang ky (Registration payload)</h2>
      <p>Service dang ky bang <code>PUT</code> toi Service Discovery (Consul):</p>
      <pre className="code-block">{`PUT http://discovery.mmvietnam.vn/v1/agent/service/register
{
    "ID": "log-service-172.26.16.109-9200",
    "Name": "log-service",
    "Tags": ["UAT", "v7.15.1"],
    "Address": "172.26.16.109",
    "Port": 9200,
    "Meta": {
        "Scheme": "http",
        "Priority": "2",
        "CheckEnpoint": "/_cluster/health"
    },
    "Check": {
        "HTTP": "http://172.26.16.109:9200/_cluster/health",
        "Interval": "10s",
        "Timeout": "3s",
        "Header": { "Authorization": ["Basic <base64(user:password)>"] }
    }
}`}</pre>
      <p>Truong <code>ID</code> theo quy uoc <code>{'<service-name>-<address>-<port>'}</code> de dam bao duy nhat cho tung instance. KHONG luu credential trong tai lieu hay source code - dung bien moi truong / secret store.</p>

      <h2>9. Vi du truy cap</h2>
      <pre className="code-block">{`// PUBLIC / PAYMENT - bat buoc qua Kong API Gateway
POST https://api.mmvietnam.vn/payment/v1/charge
GET  https://api.mmvietnam.vn/order/v1/orders

// SERVICE-TO-SERVICE noi bo - resolve qua DNS name tu Service Discovery
GET http://order-api.mmvietnam.vn/api/v1/orders

// SAI - hard-code IP hoac client ngoai goi truc tiep service
GET http://10.10.20.15:8080/api/v1/orders   // KHONG duoc phep`}</pre>

      <h2>10. API Documentation (/api-docs)</h2>
      <p>Moi API service PHAI expose tai lieu tai <code>/api-docs</code> theo chuan OpenAPI 3.x. Service khong co tai lieu se KHONG duoc phe duyet len Production.</p>
      <table className="table">
        <thead><tr><th>Endpoint</th><th>Noi dung</th></tr></thead>
        <tbody>
          <tr><td><code>/api-docs</code></td><td>Giao dien Swagger UI de doc va thu API</td></tr>
          <tr><td><code>/api-docs/openapi.json</code></td><td>Dac ta OpenAPI 3.x dang JSON</td></tr>
        </tbody>
      </table>

      <h3>10.1 Noi dung bat buoc</h3>
      <table className="table">
        <thead><tr><th>Thanh phan</th><th>Yeu cau</th></tr></thead>
        <tbody>
          <tr><td>info.title</td><td>Ten API theo functional-name</td></tr>
          <tr><td>info.version</td><td>Semantic versioning MAJOR.MINOR.PATCH</td></tr>
          <tr><td>info.contact</td><td>Ten va email team so huu API</td></tr>
          <tr><td>servers</td><td>URL ca PROD va UAT qua Kong Gateway</td></tr>
          <tr><td>securitySchemes</td><td>Mo ta phuong thuc xac thuc (OAuth2 / API key)</td></tr>
          <tr><td>Vi du</td><td>Moi endpoint co it nhat mot vi du request va response</td></tr>
        </tbody>
      </table>

      <h3>10.2 Kiem soat truy cap &amp; thu vien theo ngon ngu</h3>
      <table className="table">
        <thead><tr><th>Moi truong</th><th>Quy dinh</th></tr></thead>
        <tbody>
          <tr><td>UAT / DEV</td><td>Mo trong mang noi bo</td></tr>
          <tr><td>PROD</td><td>MAC DINH chan qua Kong (request-termination). Chi mo khi danh cho doi tac ngoai VA da duoc Architect phe duyet.</td></tr>
        </tbody>
      </table>
      <table className="table">
        <thead><tr><th>Ngon ngu</th><th>Thu vien khuyen nghi</th></tr></thead>
        <tbody>
          <tr><td>Node.js</td><td>swagger-ui-express + swagger-jsdoc</td></tr>
          <tr><td>.NET</td><td>Swashbuckle.AspNetCore</td></tr>
          <tr><td>Python</td><td>FastAPI (san co) / flasgger</td></tr>
          <tr><td>Java</td><td>springdoc-openapi</td></tr>
        </tbody>
      </table>
      <p>Tai lieu PHAI duoc sinh tu dong tu source code, KHONG viet tay rieng. Thay doi pha vo tuong thich PHAI tang MAJOR version.</p>

      <h2>11. Metrics endpoint (/metrics)</h2>
      <p>
        Moi API service PHAI expose <code>/metrics</code> theo chuan
        OpenMetrics cho Prometheus. Endpoint nay CHI mo trong mang noi bo,
        <strong> KHONG duoc route ra Kong</strong>. Kong co the van vo tinh
        forward request toi day (route dang wildcard), nen service KHONG
        duoc phu thuoc vao cau hinh Kong de bao ve endpoint nay ma PHAI tu
        chan o tang ung dung.
      </p>
      <table className="table">
        <thead><tr><th>Lop kiem soat</th><th>Quy dinh</th></tr></thead>
        <tbody>
          <tr><td>Kong plugin</td><td>request-termination cho path /metrics, tra 404 tai bien</td></tr>
          <tr><td>IP whitelist (chinh)</td><td>Chi chap nhan IP cua Prometheus server o tang TCP - lop phong thu cuoi, bat buoc</td></tr>
          <tr><td>Chan header proxy</td><td>Tu choi neu co X-Kong-Request-Id hoac X-Forwarded-For</td></tr>
          <tr><td>Ma tra ve</td><td>404 Not Found thay vi 403, de khong tiet lo su ton tai cua endpoint</td></tr>
        </tbody>
      </table>
      <p>Vi du chan tang ung dung (Node.js, dung nguyen mau trong <code>server/routes/metrics.js</code> cua site nay):</p>
      <pre className="code-block">{`const PROMETHEUS_IPS = (process.env.PROMETHEUS_IPS || '').split(',');
app.get('/metrics', async (req, res) => {
    if (req.headers['x-kong-request-id'] || req.headers['x-forwarded-for']) {
        return res.status(404).end();
    }
    const srcIp = req.socket.remoteAddress.replace('::ffff:', '');
    if (!PROMETHEUS_IPS.includes(srcIp)) {
        return res.status(404).end();
    }
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});`}</pre>
      <div className="callout">
        Vi du song cua site nay noi long kiem tra IP khi <code>PROMETHEUS_IPS</code>{' '}
        chua duoc cau hinh (de tien test cuc bo) - tren PROD PHAI luon cau
        hinh bien nay, mac dinh la <strong>tu choi</strong>.
      </div>

      <h3>11.2 Thu vien chuan theo ngon ngu</h3>
      <table className="table">
        <thead><tr><th>Ngon ngu</th><th>Thu vien bat buoc</th></tr></thead>
        <tbody>
          <tr><td>Node.js</td><td>prometheus-api-metrics (wrapper cua prom-client)</td></tr>
          <tr><td>.NET</td><td>prometheus-net</td></tr>
          <tr><td>Python</td><td>prometheus_client</td></tr>
          <tr><td>Java</td><td>micrometer / simpleclient</td></tr>
        </tbody>
      </table>

      <h3>11.4 Metrics bat buoc</h3>
      <table className="table">
        <thead><tr><th>Metric</th><th>Type</th><th>Mo ta</th></tr></thead>
        <tbody>
          <tr><td>http_request_duration_seconds</td><td>histogram</td><td>Thoi gian xu ly request (kem _count, _sum, _bucket)</td></tr>
          <tr><td>http_request_size_bytes / http_response_size_bytes</td><td>histogram</td><td>Kich thuoc request/response</td></tr>
          <tr><td>process_cpu_seconds_total, process_resident_memory_bytes, ...</td><td>counter/gauge</td><td>Runtime, tu dong thu thap</td></tr>
          <tr><td>app_version</td><td>gauge</td><td>Phien ban service dang chay</td></tr>
          <tr><td>log_shipping_failures_total</td><td>counter</td><td>So lan day log that bai</td></tr>
          <tr><td>log_fallback_active</td><td>gauge</td><td>1 = dang fallback local</td></tr>
        </tbody>
      </table>
      <p>Label chuan cua metric HTTP: <code>method</code>, <code>route</code>, <code>code</code>. <code>route</code> PHAI la template do framework sinh ra (<code>/orders/:id</code>), KHONG phai gia tri that. NGHIEM CAM dua gia tri cardinality cao (user_id, order_id, IP) vao label.</p>

      <h2>12. Logging: log-service, Retry va Fallback</h2>
      <p>Moi API service PHAI day log tap trung ve <strong>log-service</strong> (Elasticsearch), resolve qua Service Discovery.</p>

      <h3>12.1 Dinh dang log</h3>
      <p>JSON mot dong (NDJSON), UTF-8:</p>
      <pre className="code-block">{`{
    "timestamp": "2026-07-22T10:15:30.123+07:00",
    "level": "INFO",
    "service": "payment-charge",
    "env": "PROD",
    "version": "v1.2.0",
    "tenant_id": "12",
    "channel_id": 3,
    "trace_id": "a1b2c3d4e5f6",
    "client_ip": "10.20.30.40",
    "method": "POST",
    "path": "/payment/v1/charges",
    "status": 200,
    "duration_ms": 145,
    "message": "charge completed"
}`}</pre>
      <p>
        <code>path</code> trong log ghi gia tri that (khac voi <code>route</code>{' '}
        template cua metrics). NGHIEM CAM ghi mat khau, token, so the, CVV
        hay dinh danh ca nhan day du - cac truong nhay cam phai duoc masking.
      </p>

      <h3>12.2 - 12.4 Retry va Fallback</h3>
      <table className="table">
        <thead><tr><th>Tham so</th><th>Gia tri chuan</th></tr></thead>
        <tbody>
          <tr><td>So lan retry toi da</td><td>5 (exponential backoff, jitter &plusmn;20%)</td></tr>
          <tr><td>Delay ban dau &rarr; toi da</td><td>1s &rarr; 2s &rarr; 4s &rarr; 8s &rarr; 16s, tran 30s</td></tr>
          <tr><td>Timeout moi lan</td><td>3s</td></tr>
          <tr><td>Fallback</td><td>Ghi file local <code>/var/log/mmvn/{'<functional-name>'}/{'<functional-name>'}-YYYY-MM-DD.log</code>, giu 7 ngay, nen gzip</td></tr>
        </tbody>
      </table>
      <p>
        Viec day log PHAI chay bat dong bo - loi ghi log KHONG BAO GIO duoc
        lam fail request nghiep vu. Khi fallback: dat{' '}
        <code>log_fallback_active = 1</code> va tang{' '}
        <code>log_shipping_failures_total</code>; Prometheus PHAI alert neu
        trang thai nay keo dai qua 5 phut.
      </p>

      <h2>13. Message Queue (Apache Kafka)</h2>
      <p>Kafka la nen tang messaging chuan cua MMVN cho giao tiep bat dong bo. KHONG dung Kafka thay cho loi goi dong bo can phan hoi tuc thi.</p>

      <table className="table">
        <thead><tr><th>Moi truong</th><th>Bootstrap servers</th></tr></thead>
        <tbody>
          <tr><td>PROD</td><td><code>kafka.mmvietnam.vn:9092</code></td></tr>
          <tr><td>UAT</td><td><code>kafka-uat.mmvietnam.vn:9092</code></td></tr>
        </tbody>
      </table>

      <h3>13.2 Quy tac dat ten Topic</h3>
      <pre className="code-block">{`<topic-name> ::= <functional-domain>.<entity>.<event>`}</pre>
      <p>Chi chu thuong, phan cach bang dau cham; ten event dung dong tu thi qua khu (event mo ta viec DA xay ra). Toi da 249 ky tu.</p>
      <table className="table">
        <thead><tr><th>DUNG</th><th>SAI</th></tr></thead>
        <tbody>
          <tr><td>order.order.created</td><td>OrderCreated (chu hoa, thieu domain)</td></tr>
          <tr><td>payment.refund.approved</td><td>payment_refund_approved (underscore)</td></tr>
          <tr><td>inventory.stock.updated</td><td>inventory.stock.update (khong phai qua khu)</td></tr>
        </tbody>
      </table>
      <p>Consumer group: <code>{'<functional-name>-<purpose>'}</code> (vd. <code>payment-charge-order-processor</code>) - moi service tieu thu mot topic PHAI dung group rieng.</p>

      <h3>13.4 Cau hinh Topic chuan</h3>
      <table className="table">
        <thead><tr><th>Tham so</th><th>Gia tri</th></tr></thead>
        <tbody>
          <tr><td>replication.factor</td><td>3 (PROD bat buoc, UAT toi thieu 1)</td></tr>
          <tr><td>min.insync.replicas</td><td>2</td></tr>
          <tr><td>partitions</td><td>3 - 6, chi tang khong giam</td></tr>
          <tr><td>retention.ms</td><td>604800000 (7 ngay)</td></tr>
        </tbody>
      </table>
      <p>NGHIEM CAM bat auto-create topic tren Production; tao topic PROD do Infra thuc hien theo yeu cau da phe duyet.</p>

      <h3>13.5 Dinh dang Message</h3>
      <pre className="code-block">{`{
    "event_id": "9f1c2b7e-4d3a-4f88-9a21-5c7e8d0b1a34",
    "event_type": "order.order.created",
    "event_version": "1.0",
    "occurred_at": "2026-07-22T10:15:30.123+07:00",
    "producer": "order-management",
    "tenant_id": "MMVN",
    "channel_id": 3,
    "trace_id": "a1b2c3d4e5f6",
    "data": {
        "order_id": "SO-2026-001234",
        "store_code": "MM-HCM-01",
        "total_amount": 1250000,
        "currency": "VND"
    }
}`}</pre>
      <p><code>event_id</code> la UUID dung de consumer khu trung lap (idempotency). <code>event_version</code> tang khi doi cau truc pha vo tuong thich.</p>

      <h3>13.7 - 13.8 Chuan Producer / Consumer</h3>
      <table className="table">
        <thead><tr><th>Ben</th><th>Tham so</th><th>Gia tri</th></tr></thead>
        <tbody>
          <tr><td rowSpan={3}>Producer</td><td>acks</td><td>all</td></tr>
          <tr><td>enable.idempotence</td><td>true</td></tr>
          <tr><td>retries</td><td>5, kem exponential backoff</td></tr>
          <tr><td rowSpan={3}>Consumer</td><td>enable.auto.commit</td><td>false (commit thu cong sau khi xu ly xong)</td></tr>
          <tr><td>auto.offset.reset</td><td>earliest</td></tr>
          <tr><td>session.timeout.ms</td><td>45000</td></tr>
        </tbody>
      </table>
      <p>Consumer PHAI xu ly idempotent: cung mot <code>event_id</code> den nhieu lan chi tao ra mot ket qua nghiep vu (Kafka dam bao at-least-once).</p>

      <h3>13.9 Retry va Dead Letter Queue</h3>
      <p>Cung tham so exponential backoff nhu logging (muc 12.2). Het so lan retry &rarr; day sang <code>{'<topic-name>.dlq'}</code>, giu nguyen payload goc kem header <code>dlq_reason</code>, <code>dlq_error</code>, <code>dlq_original_topic</code>, <code>dlq_retry_count</code>, <code>dlq_failed_at</code>. DLQ giu retention 30 ngay; replay do Infra thuc hien sau khi khac phuc nguyen nhan goc.</p>

      <h3>13.10 Giam sat Kafka</h3>
      <table className="table">
        <thead><tr><th>Metric</th><th>Type</th><th>Label</th></tr></thead>
        <tbody>
          <tr><td>kafka_messages_produced_total / kafka_produce_errors_total</td><td>counter</td><td>topic</td></tr>
          <tr><td>kafka_produce_duration_seconds</td><td>histogram</td><td>topic</td></tr>
          <tr><td>kafka_consumer_lag</td><td>gauge</td><td>topic, partition</td></tr>
          <tr><td>kafka_dlq_messages_total</td><td>counter</td><td>topic</td></tr>
        </tbody>
      </table>
      <p>Chi dung label <code>topic</code> (va <code>partition</code> cho lag) - NGHIEM CAM dua message key, event_id hay customer_id vao label.</p>

      <h2>14. Trach nhiem</h2>
      <table className="table">
        <thead><tr><th>Vai tro</th><th>Trach nhiem</th></tr></thead>
        <tbody>
          <tr><td>Dev team</td><td>Self-registration &amp; health endpoint; expose /api-docs va /metrics; retry + fallback logging; tuan thu chuan Kafka va multi-tenant; luon goi qua DNS name.</td></tr>
          <tr><td>Infra/DevOps</td><td>Van hanh Service Discovery, Kong, log-service, Kafka, Prometheus; tao topic PROD; cau hinh DNS; nap lai log fallback va replay DLQ.</td></tr>
          <tr><td>Architect/IM</td><td>Phe duyet ten service, mo /api-docs tren PROD, phe duyet channel_id va scope, review tuan thu chuan.</td></tr>
        </tbody>
      </table>

      <h2>15. Tuan thu</h2>
      <p>
        Service khong tuan thu (hard-code IP, khong dang ky Service
        Discovery, thieu health check, thieu <code>/api-docs</code> hoac{' '}
        <code>/metrics</code>, khong co retry/fallback logging, sai chuan
        dat ten Kafka, thieu DLQ, khong co lap duoc du lieu theo
        tenant/channel, hoac khong kiem tra scope) <strong>se KHONG duoc
        phe duyet len Production</strong>.
      </p>

      <h2>Quy uoc REST bo sung (khong thuoc STD-API-SD-001)</h2>
      <p>
        Cac muc duoi day <strong>khong nam trong tai lieu chinh thuc</strong>{' '}
        - chi la quy uoc bo sung cua nhom dev cho phan STD-API-SD-001 chua
        quy dinh (hinh dang envelope response, phan trang, idempotency key).
        Ap dung khi khong mau thuan voi chuan chinh thuc; endpoint{' '}
        <code>/api/v1/projects</code> cua site nay minh hoa cac quy uoc nay.
      </p>
      <p>Thanh cong:</p>
      <pre className="code-block">{`{
  "data": { "id": "1", "name": "Website ban hang" },
  "meta": { "pagination": { "page": 1, "limit": 10, "total": 2, "total_pages": 1 } }
}`}</pre>
      <p>That bai:</p>
      <pre className="code-block">{`{
  "error": {
    "code": "validation_error",
    "message": "Truong \\"name\\" la bat buoc.",
    "details": { "fields": { "name": "required" } }
  }
}`}</pre>
      <ul>
        <li>Auth demo: Bearer token trong header <code>Authorization</code> (khac voi scope cua chuan chinh thuc, chi dung cho <code>/api/v1/projects</code>).</li>
        <li>Idempotency: header <code>Idempotency-Key</code> (UUID) cho <code>POST</code> co the bi goi lai do retry mang.</li>
      </ul>

      <div className="callout">
        Thu ngay: <code>curl http://localhost:4000/api/v1/orders -H "X-Authenticated-Scope: tenant:12 channel:3 order.read"</code>
      </div>
    </article>
  );
}
