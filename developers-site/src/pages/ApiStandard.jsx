import React from 'react';

export default function ApiStandard() {
  return (
    <article className="doc">
      <h1>API Standard</h1>
      <p className="lead">
        Chuẩn chính thức, bắt buộc áp dụng cho mọi API service của MM Mega
        Market Vietnam (MMVN). Trang này trình bày lại nội dung tài liệu gốc
        để tra cứu nhanh khi code - bản PDF/Word chính thức vẫn là nguồn tham
        chiếu pháp lý khi có tranh chấp.
      </p>

      <table className="table">
        <tbody>
          <tr><th>Mã tài liệu</th><td>STD-API-SD-001</td></tr>
          <tr><th>Phiên bản</th><td>01 (chỉnh sửa 1) - v1.1</td></tr>
          <tr><th>Ngày hiệu lực</th><td>22/07/2026</td></tr>
          <tr><th>Tên quy định</th><td>Tiêu chuẩn đăng ký &amp; truy cập API Service qua Service Discovery</td></tr>
          <tr><th>Phạm vi áp dụng</th><td>Tất cả API services của MMVN</td></tr>
          <tr><th>Đối tượng</th><td>Dev team, Infra/DevOps, Architect, đối tác phát triển</td></tr>
          <tr><th>Trạng thái</th><td><strong>Bắt buộc (Mandatory)</strong></td></tr>
        </tbody>
      </table>

      <div className="callout">
        Hai endpoint <code>/api/v1/orders</code> và <code>/metrics</code>{' '}
        của site này là <strong>ví dụ sống thực thi đúng</strong> mục 5 và mục
        11 của chuẩn này (code trong <code>developers-site/server/</code>) -
        không chỉ là mô tả, bạn có thể gọi thử ngay.
      </div>

      <h2>1. Mục đích</h2>
      <p>
        Chuẩn hóa cách các API service đăng ký và được phát hiện (discover)
        trong hệ thống MMVN. Loại bỏ việc hard-code địa chỉ IP tĩnh, cho phép
        mở rộng, failover và cân bằng tải mà không cần thay đổi cấu hình ứng
        dụng.
      </p>

      <h2>2. Nguyên tắc bắt buộc</h2>
      <ul>
        <li>Mọi API service <strong>PHẢI</strong> tự đăng ký lên Service Discovery ngay khi khởi động (self-registration).</li>
        <li>Ứng dụng consumer <strong>PHẢI</strong> truy vấn Service Discovery để lấy địa chỉ (DNS name) của service đích trước khi gọi.</li>
        <li>Mọi kết nối giữa các service <strong>PHẢI</strong> dùng DNS name - <strong>NGHIÊM CẤM</strong> hard-code địa chỉ IP.</li>
        <li>Service <strong>PHẢI</strong> cung cấp health check endpoint để Service Discovery loại bỏ instance lỗi.</li>
        <li>Service <strong>PHẢI</strong> hủy đăng ký (deregister) khi shutdown một cách chủ động (graceful).</li>
        <li>Payment service và mọi API service public <strong>PHẢI</strong> được truy cập thông qua Kong API Gateway - <strong>NGHIÊM CẤM</strong> client bên ngoài gọi trực tiếp vào service.</li>
        <li>Mọi API service <strong>PHẢI</strong> expose tài liệu OpenAPI tại <code>/api-docs</code> và metrics tại <code>/metrics</code>.</li>
        <li>Mọi API service <strong>PHẢI</strong> hỗ trợ multi-tenant và multi-channel: xác định <code>tenant_id</code>, <code>channel_id</code> và scope từ ngữ cảnh OAuth2 đã xác thực, cô lập dữ liệu theo cả hai.</li>
      </ul>

      <h2>3. Kiến trúc luồng</h2>
      <ol>
        <li>API Service khởi động &rarr; tự đăng ký (tên service, DNS name, port, health endpoint) lên Service Discovery.</li>
        <li>Service Discovery liên tục kiểm tra health; chỉ giữ lại các instance khỏe mạnh.</li>
        <li>Consumer App truy vấn Service Discovery bằng tên logic của service.</li>
        <li>Service Discovery trả về DNS name của (các) instance khả dụng.</li>
        <li>Consumer gọi API service qua DNS name đã nhận.</li>
      </ol>

      <h2>4. Naming Rule (Quy tắc đặt tên)</h2>
      <p>
        MMVN áp dụng mô hình <strong>functional naming</strong>: tên service
        phản ánh chức năng nghiệp vụ, không phản ánh công nghệ, tên team, tên
        server hay cơ cấu tổ chức. Nhờ đó tên service giữ nguyên khi thay đổi
        công nghệ hoặc tái cấu trúc phòng ban.
      </p>

      <h3>4.1 Cấu trúc tên service</h3>
      <pre className="code-block">{`<functional-name>      ::= <functional-domain>-<functional-component>
<functional-domain>    ::= [a-z][a-z0-9-]*    // nhóm nghiệp vụ
<functional-component> ::= [a-z][a-z0-9-]*    // chức năng cụ thể`}</pre>
      <p>Chỉ dùng chữ thường, phân cách bằng dấu gạch ngang (<code>-</code>), không dùng underscore, dấu cách, chữ hoa hay ký tự tiếng Việt có dấu. Độ dài khuyến nghị tối đa 30 ký tự.</p>

      <h3>4.2 Danh mục functional-domain</h3>
      <table className="table">
        <thead><tr><th>Domain</th><th>Phạm vi nghiệp vụ</th><th>Ví dụ service name</th></tr></thead>
        <tbody>
          <tr><td>payment</td><td>Thanh toán, hoàn tiền, đối soát</td><td>payment-charge, payment-refund</td></tr>
          <tr><td>order</td><td>Đơn hàng, giỏ hàng</td><td>order-management, order-fulfillment</td></tr>
          <tr><td>customer</td><td>Khách hàng, MCard loyalty</td><td>customer-profile, customer-loyalty</td></tr>
          <tr><td>product</td><td>Sản phẩm, SKU, category</td><td>product-catalog, product-pricing</td></tr>
          <tr><td>inventory</td><td>Tồn kho, kho vận</td><td>inventory-stock, inventory-transfer</td></tr>
          <tr><td>store</td><td>Cửa hàng, POS, trung tâm</td><td>store-master, store-pos</td></tr>
          <tr><td>erp</td><td>Tích hợp Oracle EBS</td><td>erp-gateway, erp-sync</td></tr>
          <tr><td>platform</td><td>Dịch vụ nền tảng dùng chung</td><td>platform-log, platform-notification</td></tr>
        </tbody>
      </table>

      <h3>4.3 Quy tắc đặt tên DNS</h3>
      <table className="table">
        <thead><tr><th>Loại</th><th>Định dạng</th><th>Ví dụ</th></tr></thead>
        <tbody>
          <tr><td>Nội bộ PROD</td><td><code>{'<functional-name>.mmvietnam.vn'}</code></td><td>payment-charge.mmvietnam.vn</td></tr>
          <tr><td>Nội bộ UAT</td><td><code>{'<functional-name>-uat.mmvietnam.vn'}</code></td><td>payment-charge-uat.mmvietnam.vn</td></tr>
          <tr><td>Public PROD</td><td><code>{'api.mmvietnam.vn/<domain>/<version>'}</code></td><td>api.mmvietnam.vn/payment/v1</td></tr>
          <tr><td>Public UAT</td><td><code>{'api-uat.mmvietnam.vn/<domain>/<version>'}</code></td><td>api-uat.mmvietnam.vn/payment/v1</td></tr>
        </tbody>
      </table>

      <h3>4.4 Service ID và Tags</h3>
      <table className="table">
        <thead><tr><th>Thành phần</th><th>Định dạng</th><th>Ví dụ</th></tr></thead>
        <tbody>
          <tr><td>Service Name</td><td><code>{'<functional-name>'}</code></td><td>payment-charge</td></tr>
          <tr><td>Service ID</td><td><code>{'<name>-<address>-<port>'}</code></td><td>payment-charge-172.26.16.109-8080</td></tr>
          <tr><td>Tag môi trường</td><td>PROD | UAT | DEV</td><td>UAT</td></tr>
          <tr><td>Tag version</td><td><code>{'v<MAJOR>.<MINOR>.<PATCH>'}</code></td><td>v7.15.1</td></tr>
        </tbody>
      </table>

      <h3>4.5 Quy tắc đặt tên REST resource path</h3>
      <ul>
        <li>Path segment dùng chữ thường, phân cách bằng dấu gạch ngang: <code>/purchase-orders</code> (KHÔNG dùng <code>/purchaseOrders</code> hay <code>/purchase_orders</code>).</li>
        <li>Tên resource dùng danh từ số nhiều: <code>/orders</code>, <code>/customers</code>, <code>/products</code> - không dùng động từ.</li>
        <li>Version bắt buộc nằm ngay sau functional-domain: <code>/payment/v1/charges</code>.</li>
        <li>Tên thuộc tính trong JSON body dùng <strong>snake_case</strong>: <code>created_at</code>, <code>order_id</code>, <code>total_amount</code>.</li>
        <li>Trường ngày giờ kết thúc bằng hậu tố <code>_at</code> hoặc chứa từ chỉ loại: <code>created_at</code>, <code>arrival_date</code>.</li>
      </ul>

      <h3>4.6 Bảng đối chiếu Đúng / Sai</h3>
      <table className="table">
        <thead><tr><th>ĐÚNG</th><th>SAI</th></tr></thead>
        <tbody>
          <tr><td>payment-charge</td><td>PaymentCharge, payment_charge</td></tr>
          <tr><td>customer-loyalty</td><td>mcard-nodejs-svc (lộ công nghệ)</td></tr>
          <tr><td>inventory-stock</td><td>team-infra-api (theo tổ chức)</td></tr>
          <tr><td>order-management.mmvietnam.vn</td><td>172.26.16.109:8080 (hard-code IP)</td></tr>
          <tr><td>/payment/v1/charges</td><td>/payment/getCharge (dùng động từ)</td></tr>
        </tbody>
      </table>

      <h3>4.7 Đăng ký tên</h3>
      <p>Mọi <code>functional-name</code> <strong>PHẢI</strong> được đăng ký và phê duyệt với Architect/Infra trước khi triển khai, nhằm đảm bảo tính duy nhất trên toàn hệ thống và tránh trùng lặp giữa các team.</p>

      <h2>5. Nguyên tắc hỗ trợ Multi-Tenant</h2>
      <p>
        MMVN vận hành nhiều pháp nhân (entity/company) trên cùng một nền
        tảng. Mỗi pháp nhân là một tenant. Mọi API service <strong>PHẢI</strong>{' '}
        được thiết kế multi-tenant ngay từ đầu - việc bổ sung sau khi hệ
        thống đã chạy gần như luôn dẫn tới rò rỉ dữ liệu chéo giữa các pháp
        nhân.
      </p>

      <h3>5.1 Mô hình cô lập dữ liệu</h3>
      <p>MMVN áp dụng mô hình <strong>shared database</strong> - các tenant dùng chung database và schema, phân biệt bằng cột <code>tenant_id</code> và <code>channel_id</code> trên mọi bảng chứa dữ liệu nghiệp vụ.</p>
      <table className="table">
        <thead><tr><th>Hạng mục</th><th>Quy định bắt buộc</th></tr></thead>
        <tbody>
          <tr><td>Cột định danh</td><td>Mọi bảng nghiệp vụ PHẢI có cột <code>tenant_id</code> và <code>channel_id</code>, NOT NULL, không có giá trị mặc định</td></tr>
          <tr><td>Index</td><td><code>tenant_id</code> PHẢI là cột đầu tiên của index chính, tiếp theo là <code>channel_id</code></td></tr>
          <tr><td>Khóa ngoại</td><td>Quan hệ giữa các bảng PHẢI kiểm tra cùng <code>tenant_id</code> và <code>channel_id</code>, tránh tham chiếu chéo</td></tr>
          <tr><td>Ràng buộc duy nhất</td><td>Unique constraint PHẢI bao gồm <code>tenant_id</code> và <code>channel_id</code> (vd: <code>UNIQUE(tenant_id, channel_id, order_code)</code>), không unique toàn cục</td></tr>
        </tbody>
      </table>
      <p>Chỉ một câu truy vấn thiếu điều kiện tenant là dữ liệu của pháp nhân này lộ sang pháp nhân khác - vì vậy các quy định ở dưới là bắt buộc tuyệt đối.</p>

      <h3>5.2 Xác thực OAuth2 và truyền ngữ cảnh</h3>
      <p>MMVN dùng OAuth2 làm chuẩn xác thực duy nhất, hai luồng:</p>
      <table className="table">
        <thead><tr><th>Luồng</th><th>Cơ chế xác thực</th><th>Nguồn ngữ cảnh</th></tr></thead>
        <tbody>
          <tr><td>External (qua Kong)</td><td>Kong OAuth2 plugin validate token tại gateway</td><td>Header do Kong chèn sau khi validate</td></tr>
          <tr><td>Service-to-service</td><td><code>x-api-key</code>, service tự validate</td><td>Claim trong JWT</td></tr>
        </tbody>
      </table>

      <p><strong>Token endpoint:</strong></p>
      <table className="table">
        <thead><tr><th>Môi trường</th><th>Token endpoint</th></tr></thead>
        <tbody>
          <tr><td>PROD</td><td><code>https://api.mmvietnam.vn/auth/{'{service-name}'}/oauth2/token</code></td></tr>
          <tr><td>UAT</td><td><code>https://api-uat.mmvietnam.vn/auth/{'{service-name}'}/oauth2/token</code></td></tr>
        </tbody>
      </table>

      <p>
        <strong>Trust model - network-based:</strong> mọi request trong mạng
        nội bộ được coi là đến từ nguồn tin cậy. Sau khi xác thực, cả hai
        luồng đều chèn header <code>X-Authenticated-Scope</code> (bởi Kong ở
        luồng external, bởi chính service ở luồng service-to-service).
      </p>

      <h3>5.2.3 Cấu trúc Scope</h3>
      <p>Scope mang cả phạm vi dữ liệu lẫn quyền thao tác, là danh sách phẳng phân cách bởi dấu cách:</p>
      <table className="table">
        <thead><tr><th>Loại</th><th>Cú pháp</th><th>Ý nghĩa</th></tr></thead>
        <tbody>
          <tr><td>Phạm vi tenant</td><td><code>tenant:{'<ma>'}</code></td><td>Pháp nhân được phép truy cập</td></tr>
          <tr><td>Phạm vi channel</td><td><code>channel:{'<so>'}</code></td><td>Kênh bán được phép, có thể xuất hiện nhiều lần</td></tr>
          <tr><td>Quyền</td><td><code>{'<domain>.<action>'}</code></td><td>Thao tác được phép: read, write, delete, admin</td></tr>
        </tbody>
      </table>
      <pre className="code-block">{`X-Authenticated-Scope: tenant:12 channel:3 channel:4 order.read order.write inventory.read`}</pre>

      <h3>5.2.4 Quy tắc áp dụng Scope</h3>
      <ul>
        <li>Token PHẢI chứa đúng MỘT mục <code>tenant:</code>. Nhiều tenant hoặc không có tenant &rarr; <strong>401 Unauthorized</strong>.</li>
        <li>Token PHẢI chứa ít nhất MỘT mục <code>channel:</code>.</li>
        <li>Quyền trong scope áp dụng cho TẤT CẢ channel có trong token. Cần phân quyền khác nhau theo từng kênh &rarr; cấp token riêng cho từng kênh.</li>
        <li>Service PHẢI kiểm tra scope TRƯỚC khi xử lý nghiệp vụ, theo thứ tự: (1) trích tenant, (2) trích danh sách channel, (3) kiểm tra quyền của endpoint.</li>
        <li>Thiếu quyền &rarr; <strong>403 Forbidden</strong> (khác với thiếu xác thực = 401).</li>
        <li>Cấp scope theo nguyên tắc tối thiểu - KHÔNG cấp admin cho tích hợp chỉ cần đọc.</li>
        <li><strong>NGHIÊM CẤM</strong> lấy scope, tenant_id hay channel_id từ query string, request body hay path do client gửi - ngữ cảnh chỉ đến từ <code>req.ctx</code> đã xác thực.</li>
        <li><strong>NGHIÊM CẤM</strong> cho phép client chỉ định <code>tenant_id</code>/<code>channel_id</code> trong payload khi tạo/cập nhật; service PHẢI tự gán từ <code>req.ctx</code> và bỏ qua giá trị client gửi.</li>
      </ul>

      <h3>5.2.5 Xác định channel đang thao tác</h3>
      <table className="table">
        <thead><tr><th>Loại thao tác</th><th>Cách xác định channel</th></tr></thead>
        <tbody>
          <tr><td>Ghi (POST/PUT/PATCH/DELETE)</td><td>Request PHẢI chỉ định channel qua header <code>X-Channel-Id</code>, phải nằm trong scope; sai &rarr; 403, thiếu khi token có nhiều channel &rarr; 400.</td></tr>
          <tr><td>Đọc một bản ghi</td><td>Lọc theo toàn bộ danh sách channel trong scope.</td></tr>
          <tr><td>Đọc danh sách</td><td>Mặc định trả về dữ liệu của MỌI channel trong scope; client có thể thu hẹp nhưng vẫn phải nằm trong scope.</td></tr>
        </tbody>
      </table>
      <p><code>X-Channel-Id</code> chỉ dùng để CHỌN trong phạm vi đã được cấp, KHÔNG BAO GIỜ dùng để mở rộng phạm vi.</p>

      <h3>5.2.6 Danh mục Sale Channel</h3>
      <table className="table">
        <thead><tr><th>channel_id</th><th>Sale Channel</th><th>Mô tả</th></tr></thead>
        <tbody>
          <tr><td>0</td><td>Cash &amp; Carry</td><td>Kênh bán lẻ tại trung tâm</td></tr>
          <tr><td>1</td><td>CCOD</td><td>Credit &amp; Cash On Delivery</td></tr>
          <tr><td>2</td><td>B2B</td><td>Kênh khách hàng doanh nghiệp</td></tr>
          <tr><td>3</td><td>Click &amp; Get</td><td>Đặt trực tuyến, https://online.mmvietnam.com</td></tr>
          <tr><td>4</td><td>Market Place</td><td>Kênh sàn thương mại điện tử</td></tr>
          <tr><td>5</td><td>Telesale</td><td>Kênh bán qua điện thoại</td></tr>
          <tr><td>6</td><td>Online BSM</td><td>Kênh trực tuyến Bs'Mart (closed)</td></tr>
          <tr><td>7</td><td>GiaTot</td><td>Kênh Giá Tốt</td></tr>
        </tbody>
      </table>
      <ul>
        <li>Danh mục <code>channel_id</code> PHẢI được đăng ký và phê duyệt tập trung bởi Architect, giống <code>functional-name</code>.</li>
        <li>KHÔNG tái sử dụng mã của kênh đã ngừng hoạt động cho kênh mới.</li>
        <li><code>channel_id = 0</code> là giá trị hợp lệ (Cash &amp; Carry) - khi kiểm tra sự tồn tại, PHẢI dùng kiểm tra null/undefined, KHÔNG dùng phép kiểm tra truthy.</li>
      </ul>

      <h3>5.3 - 5.4 Multi-Tenant trong Log và Kafka</h3>
      <ul>
        <li>Log: mọi bản ghi log PHẢI có <code>tenant_id</code> và <code>channel_id</code> (xem mục Logging).</li>
        <li>Kafka: topic dùng CHUNG cho mọi tenant/channel; <code>tenant_id</code>/<code>channel_id</code> nằm trong envelope message; message key nên là <code>{'<tenant_id>:<channel_id>:<entity_id>'}</code>; consumer thiếu các trường này PHẢI đẩy sang DLQ, không dùng giá trị mặc định.</li>
      </ul>

      <h3>5.5 Kiểm thử bắt buộc trước Production</h3>
      <table className="table">
        <thead><tr><th>Kịch bản</th><th>Kết quả mong đợi</th></tr></thead>
        <tbody>
          <tr><td>Đọc bản ghi của tenant khác bằng ID hợp lệ</td><td>404 Not Found</td></tr>
          <tr><td>Đọc bản ghi của channel ngoài scope</td><td>404 Not Found</td></tr>
          <tr><td>Cập nhật/xóa bản ghi ngoài phạm vi</td><td>404 Not Found, dữ liệu không đổi</td></tr>
          <tr><td>Gửi tenant_id / channel_id giả trong body</td><td>Bị bỏ qua, dùng giá trị từ scope</td></tr>
          <tr><td>Client external tự gửi X-Authenticated-Scope</td><td>Kong strip header, service không tin giá trị client</td></tr>
          <tr><td>Gọi trực tiếp service kèm X-Authenticated-Scope giả</td><td>Service strip header, trả 401 nếu không có x-api-key hợp lệ</td></tr>
          <tr><td>x-api-key sai/đã thu hồi</td><td>401 Unauthorized</td></tr>
          <tr><td>Scope thiếu tenant: hoặc channel:</td><td>401 Unauthorized</td></tr>
          <tr><td>Gọi endpoint ghi chỉ với quyền read</td><td>403 Forbidden</td></tr>
          <tr><td>Gửi X-Channel-Id ngoài scope</td><td>403 Forbidden</td></tr>
          <tr><td>Thiếu X-Channel-Id khi token có nhiều channel (ghi)</td><td>400 Bad Request</td></tr>
          <tr><td>Liệt kê danh sách bản ghi</td><td>Chỉ trả về dữ liệu thuộc tenant và các channel trong scope</td></tr>
        </tbody>
      </table>
      <div className="callout">
        Bộ test trên được thực thi đầy đủ bởi <code>/api/v1/orders</code> của
        site này - xem <code>server/routes/orders.js</code> và{' '}
        <code>server/middleware/scopeContext.js</code>.
      </div>

      <h2>6. Endpoint Service Discovery</h2>
      <table className="table">
        <thead><tr><th>Môi trường</th><th>URL Service Discovery</th></tr></thead>
        <tbody>
          <tr><td>PROD</td><td><code>http://discovery.mmvietnam.vn</code></td></tr>
          <tr><td>UAT</td><td><code>http://discovery-uat.mmvietnam.vn</code></td></tr>
        </tbody>
      </table>

      <h2>7. Kong API Gateway</h2>
      <p>Payment service và tất cả API service public BẮT BUỘC đi qua Kong. Client bên ngoài chỉ gọi tới domain gateway; Service Discovery và DNS name nội bộ chỉ dùng cho giao tiếp service-to-service.</p>
      <table className="table">
        <thead><tr><th>Môi trường</th><th>Kong API Gateway</th></tr></thead>
        <tbody>
          <tr><td>PROD</td><td><code>https://api.mmvietnam.vn</code></td></tr>
          <tr><td>UAT</td><td><code>https://api-uat.mmvietnam.vn</code></td></tr>
        </tbody>
      </table>

      <h2>8. Yêu cầu đăng ký (Registration payload)</h2>
      <p>Service đăng ký bằng <code>PUT</code> tới Service Discovery (Consul):</p>
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
      <p>Trường <code>ID</code> theo quy ước <code>{'<service-name>-<address>-<port>'}</code> để đảm bảo duy nhất cho từng instance. KHÔNG lưu credential trong tài liệu hay source code - dùng biến môi trường / secret store.</p>

      <h2>9. Ví dụ truy cập</h2>
      <pre className="code-block">{`// PUBLIC / PAYMENT - bắt buộc qua Kong API Gateway
POST https://api.mmvietnam.vn/payment/v1/charge
GET  https://api.mmvietnam.vn/order/v1/orders

// SERVICE-TO-SERVICE nội bộ - resolve qua DNS name từ Service Discovery
GET http://order-api.mmvietnam.vn/api/v1/orders

// SAI - hard-code IP hoặc client ngoài gọi trực tiếp service
GET http://10.10.20.15:8080/api/v1/orders   // KHÔNG được phép`}</pre>

      <h2>10. API Documentation (/api-docs)</h2>
      <p>Mọi API service PHẢI expose tài liệu tại <code>/api-docs</code> theo chuẩn OpenAPI 3.x. Service không có tài liệu sẽ KHÔNG được phê duyệt lên Production.</p>
      <table className="table">
        <thead><tr><th>Endpoint</th><th>Nội dung</th></tr></thead>
        <tbody>
          <tr><td><code>/api-docs</code></td><td>Giao diện Swagger UI để đọc và thử API</td></tr>
          <tr><td><code>/api-docs/openapi.json</code></td><td>Đặc tả OpenAPI 3.x dạng JSON</td></tr>
        </tbody>
      </table>

      <h3>10.1 Nội dung bắt buộc</h3>
      <table className="table">
        <thead><tr><th>Thành phần</th><th>Yêu cầu</th></tr></thead>
        <tbody>
          <tr><td>info.title</td><td>Tên API theo functional-name</td></tr>
          <tr><td>info.version</td><td>Semantic versioning MAJOR.MINOR.PATCH</td></tr>
          <tr><td>info.contact</td><td>Tên và email team sở hữu API</td></tr>
          <tr><td>servers</td><td>URL cả PROD và UAT qua Kong Gateway</td></tr>
          <tr><td>securitySchemes</td><td>Mô tả phương thức xác thực (OAuth2 / API key)</td></tr>
          <tr><td>Ví dụ</td><td>Mỗi endpoint có ít nhất một ví dụ request và response</td></tr>
        </tbody>
      </table>

      <h3>10.2 Kiểm soát truy cập &amp; thư viện theo ngôn ngữ</h3>
      <table className="table">
        <thead><tr><th>Môi trường</th><th>Quy định</th></tr></thead>
        <tbody>
          <tr><td>UAT / DEV</td><td>Mở trong mạng nội bộ</td></tr>
          <tr><td>PROD</td><td>MẶC ĐỊNH chặn qua Kong (request-termination). Chỉ mở khi dành cho đối tác ngoài VÀ đã được Architect phê duyệt.</td></tr>
        </tbody>
      </table>
      <table className="table">
        <thead><tr><th>Ngôn ngữ</th><th>Thư viện khuyến nghị</th></tr></thead>
        <tbody>
          <tr><td>Node.js</td><td>swagger-ui-express + swagger-jsdoc</td></tr>
          <tr><td>.NET</td><td>Swashbuckle.AspNetCore</td></tr>
          <tr><td>Python</td><td>FastAPI (sẵn có) / flasgger</td></tr>
          <tr><td>Java</td><td>springdoc-openapi</td></tr>
        </tbody>
      </table>
      <p>Tài liệu PHẢI được sinh tự động từ source code, KHÔNG viết tay riêng. Thay đổi phá vỡ tương thích PHẢI tăng MAJOR version.</p>

      <h2>11. Metrics endpoint (/metrics)</h2>
      <p>
        Mọi API service PHẢI expose <code>/metrics</code> theo chuẩn
        OpenMetrics cho Prometheus. Endpoint này CHỈ mở trong mạng nội bộ,
        <strong> KHÔNG được route ra Kong</strong>. Kong có thể vẫn vô tình
        forward request tới đây (route dạng wildcard), nên service KHÔNG
        được phụ thuộc vào cấu hình Kong để bảo vệ endpoint này mà PHẢI tự
        chặn ở tầng ứng dụng.
      </p>
      <table className="table">
        <thead><tr><th>Lớp kiểm soát</th><th>Quy định</th></tr></thead>
        <tbody>
          <tr><td>Kong plugin</td><td>request-termination cho path /metrics, trả 404 tại biên</td></tr>
          <tr><td>IP whitelist (chính)</td><td>Chỉ chấp nhận IP của Prometheus server ở tầng TCP - lớp phòng thủ cuối, bắt buộc</td></tr>
          <tr><td>Chặn header proxy</td><td>Từ chối nếu có X-Kong-Request-Id hoặc X-Forwarded-For</td></tr>
          <tr><td>Mã trả về</td><td>404 Not Found thay vì 403, để không tiết lộ sự tồn tại của endpoint</td></tr>
        </tbody>
      </table>
      <p>Ví dụ chặn tầng ứng dụng (Node.js, dùng nguyên mẫu trong <code>server/routes/metrics.js</code> của site này):</p>
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
        Ví dụ sống của site này nới lỏng kiểm tra IP khi <code>PROMETHEUS_IPS</code>{' '}
        chưa được cấu hình (để tiện test cục bộ) - trên PROD PHẢI luôn cấu
        hình biến này, mặc định là <strong>từ chối</strong>.
      </div>

      <h3>11.2 Thư viện chuẩn theo ngôn ngữ</h3>
      <table className="table">
        <thead><tr><th>Ngôn ngữ</th><th>Thư viện bắt buộc</th></tr></thead>
        <tbody>
          <tr><td>Node.js</td><td>prometheus-api-metrics (wrapper của prom-client)</td></tr>
          <tr><td>.NET</td><td>prometheus-net</td></tr>
          <tr><td>Python</td><td>prometheus_client</td></tr>
          <tr><td>Java</td><td>micrometer / simpleclient</td></tr>
        </tbody>
      </table>

      <h3>11.4 Metrics bắt buộc</h3>
      <table className="table">
        <thead><tr><th>Metric</th><th>Type</th><th>Mô tả</th></tr></thead>
        <tbody>
          <tr><td>http_request_duration_seconds</td><td>histogram</td><td>Thời gian xử lý request (kèm _count, _sum, _bucket)</td></tr>
          <tr><td>http_request_size_bytes / http_response_size_bytes</td><td>histogram</td><td>Kích thước request/response</td></tr>
          <tr><td>process_cpu_seconds_total, process_resident_memory_bytes, ...</td><td>counter/gauge</td><td>Runtime, tự động thu thập</td></tr>
          <tr><td>app_version</td><td>gauge</td><td>Phiên bản service đang chạy</td></tr>
          <tr><td>log_shipping_failures_total</td><td>counter</td><td>Số lần đẩy log thất bại</td></tr>
          <tr><td>log_fallback_active</td><td>gauge</td><td>1 = đang fallback local</td></tr>
        </tbody>
      </table>
      <p>Label chuẩn của metric HTTP: <code>method</code>, <code>route</code>, <code>code</code>. <code>route</code> PHẢI là template do framework sinh ra (<code>/orders/:id</code>), KHÔNG phải giá trị thật. NGHIÊM CẤM đưa giá trị cardinality cao (user_id, order_id, IP) vào label.</p>

      <h2>12. Logging: log-service, Retry và Fallback</h2>
      <p>Mọi API service PHẢI đẩy log tập trung về <strong>log-service</strong> (Elasticsearch), resolve qua Service Discovery.</p>

      <h3>12.1 Định dạng log</h3>
      <p>JSON một dòng (NDJSON), UTF-8:</p>
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
        <code>path</code> trong log ghi giá trị thật (khác với <code>route</code>{' '}
        template của metrics). NGHIÊM CẤM ghi mật khẩu, token, số thẻ, CVV
        hay định danh cá nhân đầy đủ - các trường nhạy cảm phải được masking.
      </p>

      <h3>12.2 - 12.4 Retry và Fallback</h3>
      <table className="table">
        <thead><tr><th>Tham số</th><th>Giá trị chuẩn</th></tr></thead>
        <tbody>
          <tr><td>Số lần retry tối đa</td><td>5 (exponential backoff, jitter &plusmn;20%)</td></tr>
          <tr><td>Delay ban đầu &rarr; tối đa</td><td>1s &rarr; 2s &rarr; 4s &rarr; 8s &rarr; 16s, trần 30s</td></tr>
          <tr><td>Timeout mỗi lần</td><td>3s</td></tr>
          <tr><td>Fallback</td><td>Ghi file local <code>/var/log/mmvn/{'<functional-name>'}/{'<functional-name>'}-YYYY-MM-DD.log</code>, giữ 7 ngày, nén gzip</td></tr>
        </tbody>
      </table>
      <p>
        Việc đẩy log PHẢI chạy bất đồng bộ - lỗi ghi log KHÔNG BAO GIỜ được
        làm fail request nghiệp vụ. Khi fallback: đặt{' '}
        <code>log_fallback_active = 1</code> và tăng{' '}
        <code>log_shipping_failures_total</code>; Prometheus PHẢI alert nếu
        trạng thái này kéo dài quá 5 phút.
      </p>

      <h2>13. Message Queue (Apache Kafka)</h2>
      <p>Kafka là nền tảng messaging chuẩn của MMVN cho giao tiếp bất đồng bộ. KHÔNG dùng Kafka thay cho lời gọi đồng bộ cần phản hồi tức thì.</p>

      <table className="table">
        <thead><tr><th>Môi trường</th><th>Bootstrap servers</th></tr></thead>
        <tbody>
          <tr><td>PROD</td><td><code>kafka.mmvietnam.vn:9092</code></td></tr>
          <tr><td>UAT</td><td><code>kafka-uat.mmvietnam.vn:9092</code></td></tr>
        </tbody>
      </table>

      <h3>13.2 Quy tắc đặt tên Topic</h3>
      <pre className="code-block">{`<topic-name> ::= <functional-domain>.<entity>.<event>`}</pre>
      <p>Chỉ chữ thường, phân cách bằng dấu chấm; tên event dùng động từ thì quá khứ (event mô tả việc ĐÃ xảy ra). Tối đa 249 ký tự.</p>
      <table className="table">
        <thead><tr><th>ĐÚNG</th><th>SAI</th></tr></thead>
        <tbody>
          <tr><td>order.order.created</td><td>OrderCreated (chữ hoa, thiếu domain)</td></tr>
          <tr><td>payment.refund.approved</td><td>payment_refund_approved (underscore)</td></tr>
          <tr><td>inventory.stock.updated</td><td>inventory.stock.update (không phải quá khứ)</td></tr>
        </tbody>
      </table>
      <p>Consumer group: <code>{'<functional-name>-<purpose>'}</code> (vd. <code>payment-charge-order-processor</code>) - mỗi service tiêu thụ một topic PHẢI dùng group riêng.</p>

      <h3>13.4 Cấu hình Topic chuẩn</h3>
      <table className="table">
        <thead><tr><th>Tham số</th><th>Giá trị</th></tr></thead>
        <tbody>
          <tr><td>replication.factor</td><td>3 (PROD bắt buộc, UAT tối thiểu 1)</td></tr>
          <tr><td>min.insync.replicas</td><td>2</td></tr>
          <tr><td>partitions</td><td>3 - 6, chỉ tăng không giảm</td></tr>
          <tr><td>retention.ms</td><td>604800000 (7 ngày)</td></tr>
        </tbody>
      </table>
      <p>NGHIÊM CẤM bật auto-create topic trên Production; tạo topic PROD do Infra thực hiện theo yêu cầu đã phê duyệt.</p>

      <h3>13.5 Định dạng Message</h3>
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
      <p><code>event_id</code> là UUID dùng để consumer khử trùng lặp (idempotency). <code>event_version</code> tăng khi đổi cấu trúc phá vỡ tương thích.</p>

      <h3>13.7 - 13.8 Chuẩn Producer / Consumer</h3>
      <table className="table">
        <thead><tr><th>Bên</th><th>Tham số</th><th>Giá trị</th></tr></thead>
        <tbody>
          <tr><td rowSpan={3}>Producer</td><td>acks</td><td>all</td></tr>
          <tr><td>enable.idempotence</td><td>true</td></tr>
          <tr><td>retries</td><td>5, kèm exponential backoff</td></tr>
          <tr><td rowSpan={3}>Consumer</td><td>enable.auto.commit</td><td>false (commit thủ công sau khi xử lý xong)</td></tr>
          <tr><td>auto.offset.reset</td><td>earliest</td></tr>
          <tr><td>session.timeout.ms</td><td>45000</td></tr>
        </tbody>
      </table>
      <p>Consumer PHẢI xử lý idempotent: cùng một <code>event_id</code> đến nhiều lần chỉ tạo ra một kết quả nghiệp vụ (Kafka đảm bảo at-least-once).</p>

      <h3>13.9 Retry và Dead Letter Queue</h3>
      <p>Cùng tham số exponential backoff như logging (mục 12.2). Hết số lần retry &rarr; đẩy sang <code>{'<topic-name>.dlq'}</code>, giữ nguyên payload gốc kèm header <code>dlq_reason</code>, <code>dlq_error</code>, <code>dlq_original_topic</code>, <code>dlq_retry_count</code>, <code>dlq_failed_at</code>. DLQ giữ retention 30 ngày; replay do Infra thực hiện sau khi khắc phục nguyên nhân gốc.</p>

      <h3>13.10 Giám sát Kafka</h3>
      <table className="table">
        <thead><tr><th>Metric</th><th>Type</th><th>Label</th></tr></thead>
        <tbody>
          <tr><td>kafka_messages_produced_total / kafka_produce_errors_total</td><td>counter</td><td>topic</td></tr>
          <tr><td>kafka_produce_duration_seconds</td><td>histogram</td><td>topic</td></tr>
          <tr><td>kafka_consumer_lag</td><td>gauge</td><td>topic, partition</td></tr>
          <tr><td>kafka_dlq_messages_total</td><td>counter</td><td>topic</td></tr>
        </tbody>
      </table>
      <p>Chỉ dùng label <code>topic</code> (và <code>partition</code> cho lag) - NGHIÊM CẤM đưa message key, event_id hay customer_id vào label.</p>

      <h2>14. Trách nhiệm</h2>
      <table className="table">
        <thead><tr><th>Vai trò</th><th>Trách nhiệm</th></tr></thead>
        <tbody>
          <tr><td>Dev team</td><td>Self-registration &amp; health endpoint; expose /api-docs và /metrics; retry + fallback logging; tuân thủ chuẩn Kafka và multi-tenant; luôn gọi qua DNS name.</td></tr>
          <tr><td>Infra/DevOps</td><td>Vận hành Service Discovery, Kong, log-service, Kafka, Prometheus; tạo topic PROD; cấu hình DNS; nạp lại log fallback và replay DLQ.</td></tr>
          <tr><td>Architect/IM</td><td>Phê duyệt tên service, mở /api-docs trên PROD, phê duyệt channel_id và scope, review tuân thủ chuẩn.</td></tr>
        </tbody>
      </table>

      <h2>15. Tuân thủ</h2>
      <p>
        Service không tuân thủ (hard-code IP, không đăng ký Service
        Discovery, thiếu health check, thiếu <code>/api-docs</code> hoặc{' '}
        <code>/metrics</code>, không có retry/fallback logging, sai chuẩn
        đặt tên Kafka, thiếu DLQ, không cô lập được dữ liệu theo
        tenant/channel, hoặc không kiểm tra scope) <strong>sẽ KHÔNG được
        phê duyệt lên Production</strong>.
      </p>

      <h2>Quy ước REST bổ sung (không thuộc STD-API-SD-001)</h2>
      <p>
        Các mục dưới đây <strong>không nằm trong tài liệu chính thức</strong>{' '}
        - chỉ là quy ước bổ sung của nhóm dev cho phần STD-API-SD-001 chưa
        quy định (hình dạng envelope response, phân trang, idempotency key).
        Áp dụng khi không mâu thuẫn với chuẩn chính thức; endpoint{' '}
        <code>/api/v1/projects</code> của site này minh họa các quy ước này.
      </p>
      <p>Thành công:</p>
      <pre className="code-block">{`{
  "data": { "id": "1", "name": "Website bán hàng" },
  "meta": { "pagination": { "page": 1, "limit": 10, "total": 2, "total_pages": 1 } }
}`}</pre>
      <p>Thất bại:</p>
      <pre className="code-block">{`{
  "error": {
    "code": "validation_error",
    "message": "Trường \\"name\\" là bắt buộc.",
    "details": { "fields": { "name": "required" } }
  }
}`}</pre>
      <ul>
        <li>Auth demo: Bearer token trong header <code>Authorization</code> (khác với scope của chuẩn chính thức, chỉ dùng cho <code>/api/v1/projects</code>).</li>
        <li>Idempotency: header <code>Idempotency-Key</code> (UUID) cho <code>POST</code> có thể bị gọi lại do retry mạng.</li>
      </ul>

      <div className="callout">
        Thử ngay: <code>curl http://localhost:4000/api/v1/orders -H "X-Authenticated-Scope: tenant:12 channel:3 order.read"</code>
      </div>
    </article>
  );
}
