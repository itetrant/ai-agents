import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

function ApiStandardEn() {
  return (
    <article className="doc">
      <h1>API Standard</h1>
      <p className="lead">
        The official, mandatory standard for every API service at MM Mega
        Market Vietnam (MMVN). This page mirrors the source document for
        quick reference while coding - the official PDF/Word document
        remains the legally authoritative reference in case of dispute.
      </p>

      <table className="table">
        <tbody>
          <tr><th>Document code</th><td>STD-API-SD-001</td></tr>
          <tr><th>Version</th><td>01 (revision 1) - v1.1</td></tr>
          <tr><th>Effective date</th><td>22/07/2026</td></tr>
          <tr><th>Regulation name</th><td>API Service registration &amp; access standard via Service Discovery</td></tr>
          <tr><th>Scope</th><td>All MMVN API services</td></tr>
          <tr><th>Audience</th><td>Dev team, Infra/DevOps, Architect, development partners</td></tr>
          <tr><th>Status</th><td><strong>Mandatory</strong></td></tr>
        </tbody>
      </table>

      <div className="callout">
        The two endpoints <code>/api/v1/orders</code> and <code>/metrics</code>{' '}
        on this site are <strong>live examples that correctly implement</strong> sections
        5 and 11 of this standard (code in <code>developers-site/server/</code>) -
        not just a description, you can call them right now.
      </div>

      <h2>1. Purpose</h2>
      <p>
        Standardize how API services register and are discovered within the
        MMVN system. Eliminates hard-coded static IP addresses, enabling
        scaling, failover, and load balancing without changing application
        configuration.
      </p>

      <h2>2. Mandatory principles</h2>
      <ul>
        <li>Every API service <strong>MUST</strong> self-register with Service Discovery immediately on startup (self-registration).</li>
        <li>Consumer applications <strong>MUST</strong> query Service Discovery to get the address (DNS name) of the target service before calling it.</li>
        <li>Every connection between services <strong>MUST</strong> use a DNS name - hard-coding IP addresses is <strong>STRICTLY FORBIDDEN</strong>.</li>
        <li>Services <strong>MUST</strong> provide a health check endpoint so Service Discovery can remove failing instances.</li>
        <li>Services <strong>MUST</strong> deregister proactively (gracefully) on shutdown.</li>
        <li>Payment services and every public API service <strong>MUST</strong> be accessed through the Kong API Gateway - external clients calling a service directly is <strong>STRICTLY FORBIDDEN</strong>.</li>
        <li>Every API service <strong>MUST</strong> expose OpenAPI documentation at <code>/api-docs</code> and metrics at <code>/metrics</code>.</li>
        <li>Every API service <strong>MUST</strong> support multi-tenant and multi-channel: determine <code>tenant_id</code>, <code>channel_id</code>, and scope from the authenticated OAuth2 context, isolating data by both.</li>
      </ul>

      <h2>3. Flow architecture</h2>
      <ol>
        <li>API Service starts &rarr; self-registers (service name, DNS name, port, health endpoint) with Service Discovery.</li>
        <li>Service Discovery continuously checks health; only keeps healthy instances.</li>
        <li>Consumer App queries Service Discovery by the service's logical name.</li>
        <li>Service Discovery returns the DNS name of the available instance(s).</li>
        <li>Consumer calls the API service via the DNS name it received.</li>
      </ol>

      <h2>4. Naming Rule</h2>
      <p>
        MMVN uses a <strong>functional naming</strong> model: the service
        name reflects its business function, not its technology, team name,
        server name, or org structure. This way the service name stays
        stable when technology changes or departments are restructured.
      </p>

      <h3>4.1 Service name structure</h3>
      <pre className="code-block">{`<functional-name>      ::= <functional-domain>-<functional-component>
<functional-domain>    ::= [a-z][a-z0-9-]*    // business group
<functional-component> ::= [a-z][a-z0-9-]*    // specific function`}</pre>
      <p>Lowercase letters only, separated by a hyphen (<code>-</code>); no underscores, spaces, uppercase letters, or accented Vietnamese characters. Recommended maximum length: 30 characters.</p>

      <h3>4.2 functional-domain catalog</h3>
      <table className="table">
        <thead><tr><th>Domain</th><th>Business scope</th><th>Example service name</th></tr></thead>
        <tbody>
          <tr><td>payment</td><td>Payment, refunds, reconciliation</td><td>payment-charge, payment-refund</td></tr>
          <tr><td>order</td><td>Orders, cart</td><td>order-management, order-fulfillment</td></tr>
          <tr><td>customer</td><td>Customers, MCard loyalty</td><td>customer-profile, customer-loyalty</td></tr>
          <tr><td>product</td><td>Products, SKUs, category</td><td>product-catalog, product-pricing</td></tr>
          <tr><td>inventory</td><td>Stock, warehousing</td><td>inventory-stock, inventory-transfer</td></tr>
          <tr><td>store</td><td>Stores, POS, hub</td><td>store-master, store-pos</td></tr>
          <tr><td>erp</td><td>Oracle EBS integration</td><td>erp-gateway, erp-sync</td></tr>
          <tr><td>platform</td><td>Shared platform services</td><td>platform-log, platform-notification</td></tr>
        </tbody>
      </table>

      <h3>4.3 DNS naming rules</h3>
      <table className="table">
        <thead><tr><th>Type</th><th>Format</th><th>Example</th></tr></thead>
        <tbody>
          <tr><td>Internal PROD</td><td><code>{'<functional-name>.mmvietnam.vn'}</code></td><td>payment-charge.mmvietnam.vn</td></tr>
          <tr><td>Internal UAT</td><td><code>{'<functional-name>-uat.mmvietnam.vn'}</code></td><td>payment-charge-uat.mmvietnam.vn</td></tr>
          <tr><td>Public PROD</td><td><code>{'api.mmvietnam.vn/<domain>/<version>'}</code></td><td>api.mmvietnam.vn/payment/v1</td></tr>
          <tr><td>Public UAT</td><td><code>{'api-uat.mmvietnam.vn/<domain>/<version>'}</code></td><td>api-uat.mmvietnam.vn/payment/v1</td></tr>
        </tbody>
      </table>

      <h3>4.4 Service ID and Tags</h3>
      <table className="table">
        <thead><tr><th>Component</th><th>Format</th><th>Example</th></tr></thead>
        <tbody>
          <tr><td>Service Name</td><td><code>{'<functional-name>'}</code></td><td>payment-charge</td></tr>
          <tr><td>Service ID</td><td><code>{'<name>-<address>-<port>'}</code></td><td>payment-charge-172.26.16.109-8080</td></tr>
          <tr><td>Environment tag</td><td>PROD | UAT | DEV</td><td>UAT</td></tr>
          <tr><td>Version tag</td><td><code>{'v<MAJOR>.<MINOR>.<PATCH>'}</code></td><td>v7.15.1</td></tr>
        </tbody>
      </table>

      <h3>4.5 REST resource path naming rules</h3>
      <ul>
        <li>Path segments use lowercase, hyphen-separated: <code>/purchase-orders</code> (NOT <code>/purchaseOrders</code> or <code>/purchase_orders</code>).</li>
        <li>Resource names use plural nouns: <code>/orders</code>, <code>/customers</code>, <code>/products</code> - not verbs.</li>
        <li>The version must come right after the functional-domain: <code>/payment/v1/charges</code>.</li>
        <li>JSON body property names use <strong>snake_case</strong>: <code>created_at</code>, <code>order_id</code>, <code>total_amount</code>.</li>
        <li>Date/time fields end with the <code>_at</code> suffix or contain a word indicating the type: <code>created_at</code>, <code>arrival_date</code>.</li>
      </ul>

      <h3>4.6 Correct / Incorrect comparison table</h3>
      <table className="table">
        <thead><tr><th>CORRECT</th><th>WRONG</th></tr></thead>
        <tbody>
          <tr><td>payment-charge</td><td>PaymentCharge, payment_charge</td></tr>
          <tr><td>customer-loyalty</td><td>mcard-nodejs-svc (leaks technology)</td></tr>
          <tr><td>inventory-stock</td><td>team-infra-api (based on org structure)</td></tr>
          <tr><td>order-management.mmvietnam.vn</td><td>172.26.16.109:8080 (hard-coded IP)</td></tr>
          <tr><td>/payment/v1/charges</td><td>/payment/getCharge (uses a verb)</td></tr>
        </tbody>
      </table>

      <h3>4.7 Name registration</h3>
      <p>Every <code>functional-name</code> <strong>MUST</strong> be registered and approved by Architect/Infra before deployment, to guarantee system-wide uniqueness and avoid collisions between teams.</p>

      <h2>5. Multi-Tenant support principles</h2>
      <p>
        MMVN operates multiple legal entities (entity/company) on a shared
        platform. Each legal entity is a tenant. Every API service{' '}
        <strong>MUST</strong> be designed for multi-tenancy from the start -
        retrofitting it after the system is already running almost always
        leads to cross-tenant data leaks.
      </p>

      <h3>5.1 Data isolation model</h3>
      <p>MMVN uses a <strong>shared database</strong> model - tenants share the same database and schema, distinguished by <code>tenant_id</code> and <code>channel_id</code> columns on every table holding business data.</p>
      <table className="table">
        <thead><tr><th>Item</th><th>Mandatory requirement</th></tr></thead>
        <tbody>
          <tr><td>Identifier columns</td><td>Every business table MUST have <code>tenant_id</code> and <code>channel_id</code> columns, NOT NULL, with no default value</td></tr>
          <tr><td>Index</td><td><code>tenant_id</code> MUST be the first column of the primary index, followed by <code>channel_id</code></td></tr>
          <tr><td>Foreign keys</td><td>Relationships between tables MUST check both <code>tenant_id</code> and <code>channel_id</code>, to avoid cross-references</td></tr>
          <tr><td>Unique constraints</td><td>Unique constraints MUST include <code>tenant_id</code> and <code>channel_id</code> (e.g. <code>UNIQUE(tenant_id, channel_id, order_code)</code>), never globally unique</td></tr>
        </tbody>
      </table>
      <p>A single query missing a tenant condition is enough for one legal entity's data to leak to another - so the rules below are absolutely mandatory.</p>

      <h3>5.2 OAuth2 authentication and context propagation</h3>
      <p>MMVN uses OAuth2 as its sole authentication standard, with two flows:</p>
      <table className="table">
        <thead><tr><th>Flow</th><th>Authentication mechanism</th><th>Context source</th></tr></thead>
        <tbody>
          <tr><td>External (via Kong)</td><td>Kong OAuth2 plugin validates the token at the gateway</td><td>Header injected by Kong after validation</td></tr>
          <tr><td>Service-to-service</td><td><code>x-api-key</code>, service validates itself</td><td>Claim inside the JWT</td></tr>
        </tbody>
      </table>

      <p><strong>Token endpoint:</strong></p>
      <table className="table">
        <thead><tr><th>Environment</th><th>Token endpoint</th></tr></thead>
        <tbody>
          <tr><td>PROD</td><td><code>https://api.mmvietnam.vn/auth/{'{service-name}'}/oauth2/token</code></td></tr>
          <tr><td>UAT</td><td><code>https://api-uat.mmvietnam.vn/auth/{'{service-name}'}/oauth2/token</code></td></tr>
        </tbody>
      </table>

      <p>
        <strong>Trust model - network-based:</strong> every request within
        the internal network is considered to come from a trusted source.
        After authentication, both flows inject the{' '}
        <code>X-Authenticated-Scope</code> header (by Kong on the external
        flow, by the service itself on the service-to-service flow).
      </p>

      <h3>5.2.3 Scope structure</h3>
      <p>Scope carries both the data scope and the operation permissions, as a flat space-separated list:</p>
      <table className="table">
        <thead><tr><th>Type</th><th>Syntax</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td>Tenant scope</td><td><code>tenant:{'<id>'}</code></td><td>Legal entity allowed to be accessed</td></tr>
          <tr><td>Channel scope</td><td><code>channel:{'<number>'}</code></td><td>Allowed sales channel, may appear multiple times</td></tr>
          <tr><td>Permission</td><td><code>{'<domain>.<action>'}</code></td><td>Allowed operation: read, write, delete, admin</td></tr>
        </tbody>
      </table>
      <pre className="code-block">{`X-Authenticated-Scope: tenant:12 channel:3 channel:4 order.read order.write inventory.read`}</pre>

      <h3>5.2.4 Scope enforcement rules</h3>
      <ul>
        <li>The token MUST contain exactly ONE <code>tenant:</code> entry. Multiple tenants or no tenant &rarr; <strong>401 Unauthorized</strong>.</li>
        <li>The token MUST contain at least ONE <code>channel:</code> entry.</li>
        <li>Permissions in the scope apply to ALL channels present in the token. If different permissions are needed per channel &rarr; issue separate tokens per channel.</li>
        <li>The service MUST check the scope BEFORE processing business logic, in this order: (1) extract tenant, (2) extract channel list, (3) check the endpoint's permission.</li>
        <li>Missing permission &rarr; <strong>403 Forbidden</strong> (different from missing authentication = 401).</li>
        <li>Grant scopes on the principle of least privilege - do NOT grant admin to integrations that only need to read.</li>
        <li>It is <strong>STRICTLY FORBIDDEN</strong> to take scope, tenant_id, or channel_id from the query string, request body, or path sent by the client - context only ever comes from the authenticated <code>req.ctx</code>.</li>
        <li>It is <strong>STRICTLY FORBIDDEN</strong> to let the client specify <code>tenant_id</code>/<code>channel_id</code> in the payload when creating/updating; the service MUST assign them from <code>req.ctx</code> and ignore any value sent by the client.</li>
      </ul>

      <h3>5.2.5 Determining the active channel</h3>
      <table className="table">
        <thead><tr><th>Operation type</th><th>How the channel is determined</th></tr></thead>
        <tbody>
          <tr><td>Write (POST/PUT/PATCH/DELETE)</td><td>The request MUST specify the channel via the <code>X-Channel-Id</code> header, which must be within scope; wrong &rarr; 403, missing when the token has multiple channels &rarr; 400.</td></tr>
          <tr><td>Read a single record</td><td>Filter across the full list of channels in scope.</td></tr>
          <tr><td>Read a list</td><td>By default returns data for EVERY channel in scope; the client may narrow it but must still stay within scope.</td></tr>
        </tbody>
      </table>
      <p><code>X-Channel-Id</code> is only used to SELECT within the scope already granted, NEVER to expand that scope.</p>

      <h3>5.2.6 Sale Channel catalog</h3>
      <table className="table">
        <thead><tr><th>channel_id</th><th>Sale Channel</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td>0</td><td>Cash &amp; Carry</td><td>In-store retail channel</td></tr>
          <tr><td>1</td><td>CCOD</td><td>Credit &amp; Cash On Delivery</td></tr>
          <tr><td>2</td><td>B2B</td><td>Business customer channel</td></tr>
          <tr><td>3</td><td>Click &amp; Get</td><td>Online ordering, https://online.mmvietnam.com</td></tr>
          <tr><td>4</td><td>Market Place</td><td>E-commerce marketplace channel</td></tr>
          <tr><td>5</td><td>Telesale</td><td>Phone sales channel</td></tr>
          <tr><td>6</td><td>Online BSM</td><td>Bs'Mart online channel (closed)</td></tr>
          <tr><td>7</td><td>GiaTot</td><td>Gia Tot channel</td></tr>
        </tbody>
      </table>
      <ul>
        <li>The <code>channel_id</code> catalog MUST be centrally registered and approved by Architect, same as functional-name.</li>
        <li>Do NOT reuse the code of a discontinued channel for a new one.</li>
        <li><code>channel_id = 0</code> is a valid value (Cash &amp; Carry) - when checking for existence, you MUST use a null/undefined check, NOT a truthy check.</li>
      </ul>

      <h3>5.3 - 5.4 Multi-Tenant in Logging and Kafka</h3>
      <ul>
        <li>Logging: every log record MUST have <code>tenant_id</code> and <code>channel_id</code> (see the Logging section).</li>
        <li>Kafka: topics are SHARED across every tenant/channel; <code>tenant_id</code>/<code>channel_id</code> live inside the message envelope; the message key should be <code>{'<tenant_id>:<channel_id>:<entity_id>'}</code>; a consumer missing these fields MUST push to the DLQ, never fall back to a default value.</li>
      </ul>

      <h3>5.5 Mandatory testing before Production</h3>
      <table className="table">
        <thead><tr><th>Scenario</th><th>Expected result</th></tr></thead>
        <tbody>
          <tr><td>Read another tenant's record using a valid ID</td><td>404 Not Found</td></tr>
          <tr><td>Read a record from a channel outside scope</td><td>404 Not Found</td></tr>
          <tr><td>Update/delete a record outside scope</td><td>404 Not Found, data unchanged</td></tr>
          <tr><td>Send a fake tenant_id / channel_id in the body</td><td>Ignored, value from scope is used</td></tr>
          <tr><td>External client sends its own X-Authenticated-Scope</td><td>Kong strips the header, service doesn't trust the client value</td></tr>
          <tr><td>Call the service directly with a forged X-Authenticated-Scope</td><td>Service strips the header, returns 401 if there's no valid x-api-key</td></tr>
          <tr><td>Wrong / revoked x-api-key</td><td>401 Unauthorized</td></tr>
          <tr><td>Scope missing tenant: or channel:</td><td>401 Unauthorized</td></tr>
          <tr><td>Call a write endpoint with only read permission</td><td>403 Forbidden</td></tr>
          <tr><td>Send an X-Channel-Id outside scope</td><td>403 Forbidden</td></tr>
          <tr><td>Missing X-Channel-Id when the token has multiple channels (write)</td><td>400 Bad Request</td></tr>
          <tr><td>List records</td><td>Only returns data belonging to the tenant and channels in scope</td></tr>
        </tbody>
      </table>
      <div className="callout">
        The test suite above is fully implemented by <code>/api/v1/orders</code> on
        this site - see <code>server/routes/orders.js</code> and{' '}
        <code>server/middleware/scopeContext.js</code>.
      </div>

      <h2>6. Service Discovery endpoint</h2>
      <table className="table">
        <thead><tr><th>Environment</th><th>Service Discovery URL</th></tr></thead>
        <tbody>
          <tr><td>PROD</td><td><code>http://discovery.mmvietnam.vn</code></td></tr>
          <tr><td>UAT</td><td><code>http://discovery-uat.mmvietnam.vn</code></td></tr>
        </tbody>
      </table>

      <h2>7. Kong API Gateway</h2>
      <p>Payment services and all public API services MUST go through Kong. External clients only ever call the gateway domain; Service Discovery and internal DNS names are only for service-to-service communication.</p>
      <table className="table">
        <thead><tr><th>Environment</th><th>Kong API Gateway</th></tr></thead>
        <tbody>
          <tr><td>PROD</td><td><code>https://api.mmvietnam.vn</code></td></tr>
          <tr><td>UAT</td><td><code>https://api-uat.mmvietnam.vn</code></td></tr>
        </tbody>
      </table>

      <h2>8. Registration requirements (Registration payload)</h2>
      <p>A service registers via <code>PUT</code> to Service Discovery (Consul):</p>
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
      <p>The <code>ID</code> field follows the convention <code>{'<service-name>-<address>-<port>'}</code> to guarantee uniqueness per instance. Do NOT store credentials in documentation or source code - use environment variables / a secret store.</p>

      <h2>9. Access examples</h2>
      <pre className="code-block">{`// PUBLIC / PAYMENT - must go through the Kong API Gateway
POST https://api.mmvietnam.vn/payment/v1/charge
GET  https://api.mmvietnam.vn/order/v1/orders

// SERVICE-TO-SERVICE internal - resolved via DNS name from Service Discovery
GET http://order-api.mmvietnam.vn/api/v1/orders

// WRONG - hard-coded IP or an external client calling the service directly
GET http://10.10.20.15:8080/api/v1/orders   // NOT allowed`}</pre>

      <h2>10. API Documentation (/api-docs)</h2>
      <p>Every API service MUST expose documentation at <code>/api-docs</code> following the OpenAPI 3.x standard. A service without documentation will NOT be approved for Production.</p>
      <table className="table">
        <thead><tr><th>Endpoint</th><th>Content</th></tr></thead>
        <tbody>
          <tr><td><code>/api-docs</code></td><td>Swagger UI for reading and trying out the API</td></tr>
          <tr><td><code>/api-docs/openapi.json</code></td><td>OpenAPI 3.x spec in JSON</td></tr>
        </tbody>
      </table>

      <h3>10.1 Mandatory content</h3>
      <table className="table">
        <thead><tr><th>Component</th><th>Requirement</th></tr></thead>
        <tbody>
          <tr><td>info.title</td><td>API name following functional-name</td></tr>
          <tr><td>info.version</td><td>Semantic versioning MAJOR.MINOR.PATCH</td></tr>
          <tr><td>info.contact</td><td>Name and email of the team that owns the API</td></tr>
          <tr><td>servers</td><td>URLs for both PROD and UAT via the Kong Gateway</td></tr>
          <tr><td>securitySchemes</td><td>Description of the authentication method (OAuth2 / API key)</td></tr>
          <tr><td>Examples</td><td>Every endpoint has at least one request and response example</td></tr>
        </tbody>
      </table>

      <h3>10.2 Access control &amp; language-specific libraries</h3>
      <table className="table">
        <thead><tr><th>Environment</th><th>Rule</th></tr></thead>
        <tbody>
          <tr><td>UAT / DEV</td><td>Open within the internal network</td></tr>
          <tr><td>PROD</td><td>BLOCKED by default via Kong (request-termination). Only opened for external partners AND after Architect approval.</td></tr>
        </tbody>
      </table>
      <table className="table">
        <thead><tr><th>Language</th><th>Recommended library</th></tr></thead>
        <tbody>
          <tr><td>Node.js</td><td>swagger-ui-express + swagger-jsdoc</td></tr>
          <tr><td>.NET</td><td>Swashbuckle.AspNetCore</td></tr>
          <tr><td>Python</td><td>FastAPI (built-in) / flasgger</td></tr>
          <tr><td>Java</td><td>springdoc-openapi</td></tr>
        </tbody>
      </table>
      <p>Documentation MUST be generated automatically from source code, not hand-written separately. A breaking change MUST bump the MAJOR version.</p>

      <h2>11. Metrics endpoint (/metrics)</h2>
      <p>
        Every API service MUST expose <code>/metrics</code> following the
        OpenMetrics standard for Prometheus. This endpoint is ONLY open
        within the internal network, and{' '}
        <strong>MUST NOT be routed out through Kong</strong>. Kong may still
        accidentally forward requests here (wildcard routes), so the
        service MUST NOT rely on Kong configuration to protect this
        endpoint and MUST block it itself at the application layer.
      </p>
      <table className="table">
        <thead><tr><th>Control layer</th><th>Rule</th></tr></thead>
        <tbody>
          <tr><td>Kong plugin</td><td>request-termination for the /metrics path, returns 404 at the edge</td></tr>
          <tr><td>IP whitelist (primary)</td><td>Only accepts the Prometheus server's IP at the TCP layer - the mandatory last line of defense</td></tr>
          <tr><td>Block proxy headers</td><td>Reject if X-Kong-Request-Id or X-Forwarded-For is present</td></tr>
          <tr><td>Return code</td><td>404 Not Found instead of 403, so as not to reveal the endpoint exists</td></tr>
        </tbody>
      </table>
      <p>Example of application-layer blocking (Node.js, using the actual pattern in <code>server/routes/metrics.js</code> on this site):</p>
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
        The live example on this site relaxes the IP check when{' '}
        <code>PROMETHEUS_IPS</code> isn't configured (for easier local
        testing) - in PROD this variable MUST always be configured,
        defaulting to <strong>deny</strong>.
      </div>

      <h3>11.2 Standard libraries by language</h3>
      <table className="table">
        <thead><tr><th>Language</th><th>Mandatory library</th></tr></thead>
        <tbody>
          <tr><td>Node.js</td><td>prometheus-api-metrics (wrapper of prom-client)</td></tr>
          <tr><td>.NET</td><td>prometheus-net</td></tr>
          <tr><td>Python</td><td>prometheus_client</td></tr>
          <tr><td>Java</td><td>micrometer / simpleclient</td></tr>
        </tbody>
      </table>

      <h3>11.4 Mandatory metrics</h3>
      <table className="table">
        <thead><tr><th>Metric</th><th>Type</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td>http_request_duration_seconds</td><td>histogram</td><td>Request processing time (with _count, _sum, _bucket)</td></tr>
          <tr><td>http_request_size_bytes / http_response_size_bytes</td><td>histogram</td><td>Request/response size</td></tr>
          <tr><td>process_cpu_seconds_total, process_resident_memory_bytes, ...</td><td>counter/gauge</td><td>Runtime, collected automatically</td></tr>
          <tr><td>app_version</td><td>gauge</td><td>Running service version</td></tr>
          <tr><td>log_shipping_failures_total</td><td>counter</td><td>Number of failed log shipments</td></tr>
          <tr><td>log_fallback_active</td><td>gauge</td><td>1 = currently on local fallback</td></tr>
        </tbody>
      </table>
      <p>Standard HTTP metric labels: <code>method</code>, <code>route</code>, <code>code</code>. <code>route</code> MUST be the template generated by the framework (<code>/orders/:id</code>), NOT the actual value. It is STRICTLY FORBIDDEN to put high-cardinality values (user_id, order_id, IP) into a label.</p>

      <h2>12. Logging: log-service, Retry and Fallback</h2>
      <p>Every API service MUST ship centralized logs to <strong>log-service</strong> (Elasticsearch), resolved via Service Discovery.</p>

      <h3>12.1 Log format</h3>
      <p>Single-line JSON (NDJSON), UTF-8:</p>
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
        <code>path</code> in the log records the real value (unlike the{' '}
        <code>route</code> template used for metrics). It is STRICTLY
        FORBIDDEN to log passwords, tokens, card numbers, CVVs, or full
        personal identifiers - sensitive fields must be masked.
      </p>

      <h3>12.2 - 12.4 Retry and Fallback</h3>
      <table className="table">
        <thead><tr><th>Parameter</th><th>Standard value</th></tr></thead>
        <tbody>
          <tr><td>Max retry attempts</td><td>5 (exponential backoff, jitter &plusmn;20%)</td></tr>
          <tr><td>Initial &rarr; max delay</td><td>1s &rarr; 2s &rarr; 4s &rarr; 8s &rarr; 16s, capped at 30s</td></tr>
          <tr><td>Timeout per attempt</td><td>3s</td></tr>
          <tr><td>Fallback</td><td>Write to local file <code>/var/log/mmvn/{'<functional-name>'}/{'<functional-name>'}-YYYY-MM-DD.log</code>, keep 7 days, gzip compressed</td></tr>
        </tbody>
      </table>
      <p>
        Shipping logs MUST run asynchronously - a logging failure must
        NEVER fail the business request. On fallback: set{' '}
        <code>log_fallback_active = 1</code> and increment{' '}
        <code>log_shipping_failures_total</code>; Prometheus MUST alert if
        this state persists beyond 5 minutes.
      </p>

      <h2>13. Message Queue (Apache Kafka)</h2>
      <p>Kafka is MMVN's standard platform for asynchronous communication. Do NOT use Kafka in place of a synchronous call that needs an immediate response.</p>

      <table className="table">
        <thead><tr><th>Environment</th><th>Bootstrap servers</th></tr></thead>
        <tbody>
          <tr><td>PROD</td><td><code>kafka.mmvietnam.vn:9092</code></td></tr>
          <tr><td>UAT</td><td><code>kafka-uat.mmvietnam.vn:9092</code></td></tr>
        </tbody>
      </table>

      <h3>13.2 Topic naming rules</h3>
      <pre className="code-block">{`<topic-name> ::= <functional-domain>.<entity>.<event>`}</pre>
      <p>Lowercase only, dot-separated; event names use the past tense (the event describes something that HAS happened). Maximum 249 characters.</p>
      <table className="table">
        <thead><tr><th>CORRECT</th><th>WRONG</th></tr></thead>
        <tbody>
          <tr><td>order.order.created</td><td>OrderCreated (uppercase, missing domain)</td></tr>
          <tr><td>payment.refund.approved</td><td>payment_refund_approved (underscore)</td></tr>
          <tr><td>inventory.stock.updated</td><td>inventory.stock.update (not past tense)</td></tr>
        </tbody>
      </table>
      <p>Consumer group: <code>{'<functional-name>-<purpose>'}</code> (e.g. <code>payment-charge-order-processor</code>) - each service consuming a topic MUST use its own group.</p>

      <h3>13.4 Standard topic configuration</h3>
      <table className="table">
        <thead><tr><th>Parameter</th><th>Value</th></tr></thead>
        <tbody>
          <tr><td>replication.factor</td><td>3 (mandatory in PROD, minimum 1 in UAT)</td></tr>
          <tr><td>min.insync.replicas</td><td>2</td></tr>
          <tr><td>partitions</td><td>3 - 6, only increase, never decrease</td></tr>
          <tr><td>retention.ms</td><td>604800000 (7 days)</td></tr>
        </tbody>
      </table>
      <p>Enabling auto-create topic in Production is STRICTLY FORBIDDEN; PROD topics are created by Infra based on an approved request.</p>

      <h3>13.5 Message format</h3>
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
      <p><code>event_id</code> is a UUID used by consumers to deduplicate (idempotency). <code>event_version</code> is incremented when a structural change breaks compatibility.</p>

      <h3>13.7 - 13.8 Producer / Consumer standards</h3>
      <table className="table">
        <thead><tr><th>Side</th><th>Parameter</th><th>Value</th></tr></thead>
        <tbody>
          <tr><td rowSpan={3}>Producer</td><td>acks</td><td>all</td></tr>
          <tr><td>enable.idempotence</td><td>true</td></tr>
          <tr><td>retries</td><td>5, with exponential backoff</td></tr>
          <tr><td rowSpan={3}>Consumer</td><td>enable.auto.commit</td><td>false (commit manually after processing)</td></tr>
          <tr><td>auto.offset.reset</td><td>earliest</td></tr>
          <tr><td>session.timeout.ms</td><td>45000</td></tr>
        </tbody>
      </table>
      <p>Consumers MUST process idempotently: the same <code>event_id</code> arriving multiple times must only produce one business outcome (Kafka guarantees at-least-once delivery).</p>

      <h3>13.9 Retry and Dead Letter Queue</h3>
      <p>Same exponential backoff parameters as logging (section 12.2). After exhausting retries &rarr; push to <code>{'<topic-name>.dlq'}</code>, keeping the original payload with the headers <code>dlq_reason</code>, <code>dlq_error</code>, <code>dlq_original_topic</code>, <code>dlq_retry_count</code>, <code>dlq_failed_at</code>. The DLQ retains messages for 30 days; replay is performed by Infra after the root cause is fixed.</p>

      <h3>13.10 Kafka monitoring</h3>
      <table className="table">
        <thead><tr><th>Metric</th><th>Type</th><th>Label</th></tr></thead>
        <tbody>
          <tr><td>kafka_messages_produced_total / kafka_produce_errors_total</td><td>counter</td><td>topic</td></tr>
          <tr><td>kafka_produce_duration_seconds</td><td>histogram</td><td>topic</td></tr>
          <tr><td>kafka_consumer_lag</td><td>gauge</td><td>topic, partition</td></tr>
          <tr><td>kafka_dlq_messages_total</td><td>counter</td><td>topic</td></tr>
        </tbody>
      </table>
      <p>Only use the <code>topic</code> label (and <code>partition</code> for lag) - it is STRICTLY FORBIDDEN to put the message key, event_id, or customer_id into a label.</p>

      <h2>14. Responsibilities</h2>
      <table className="table">
        <thead><tr><th>Role</th><th>Responsibility</th></tr></thead>
        <tbody>
          <tr><td>Dev team</td><td>Self-registration &amp; health endpoint; expose /api-docs and /metrics; retry + fallback logging; comply with Kafka and multi-tenant standards; always call via DNS name.</td></tr>
          <tr><td>Infra/DevOps</td><td>Operate Service Discovery, Kong, log-service, Kafka, Prometheus; create PROD topics; configure DNS; reload log fallback and replay the DLQ.</td></tr>
          <tr><td>Architect/IM</td><td>Approve service names, open /api-docs in PROD, approve channel_id and scope, review standard compliance.</td></tr>
        </tbody>
      </table>

      <h2>15. Compliance</h2>
      <p>
        A non-compliant service (hard-coded IP, not registered with Service
        Discovery, missing health check, missing <code>/api-docs</code> or{' '}
        <code>/metrics</code>, no retry/fallback logging, incorrect Kafka
        naming, missing DLQ, unable to isolate data by tenant/channel, or
        not checking scope) <strong>will NOT be approved for
        Production</strong>.
      </p>

      <h2>Additional REST conventions (not part of STD-API-SD-001)</h2>
      <p>
        The sections below are <strong>not part of the official
        document</strong> - they are additional conventions proposed by the
        dev team for areas STD-API-SD-001 doesn't cover (response envelope
        shape, pagination, idempotency key). Apply them when they don't
        conflict with the official standard; the{' '}
        <code>/api/v1/projects</code> endpoint on this site illustrates
        these conventions.
      </p>
      <p>Success:</p>
      <pre className="code-block">{`{
  "data": { "id": "1", "name": "Sales website" },
  "meta": { "pagination": { "page": 1, "limit": 10, "total": 2, "total_pages": 1 } }
}`}</pre>
      <p>Failure:</p>
      <pre className="code-block">{`{
  "error": {
    "code": "validation_error",
    "message": "The \\"name\\" field is required.",
    "details": { "fields": { "name": "required" } }
  }
}`}</pre>
      <ul>
        <li>Auth demo: Bearer token in the <code>Authorization</code> header (different from the official standard's scope, only used for <code>/api/v1/projects</code>).</li>
        <li>Idempotency: <code>Idempotency-Key</code> header (UUID) for <code>POST</code> requests that might be retried due to network retries.</li>
      </ul>

      <div className="callout">
        Try it now: <code>curl http://localhost:4000/api/v1/orders -H "X-Authenticated-Scope: tenant:12 channel:3 order.read"</code>
      </div>
    </article>
  );
}

function ApiStandardVi() {
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

export default function ApiStandard() {
  const { lang } = useLanguage();
  return lang === 'en' ? <ApiStandardEn /> : <ApiStandardVi />;
}
