import axios, {
  AxiosHeaders,
  AxiosProxyConfig,
  AxiosRequestConfig,
} from "axios";
import https from "https";

import { config } from "dotenv";

// load .env file with proxy credentials
config();

// define https agent
const CIPHERS = [
  "TLS_CHACHA20_POLY1305_SHA256",
  "TLS_AES_128_GCM_SHA256",
  "TLS_AES_256_GCM_SHA384",
];

const SIGALGS = [
  "ecdsa_secp256r1_sha256",
  "rsa_pss_rsae_sha256",
  "rsa_pkcs1_sha256",
  "ecdsa_secp384r1_sha384",
  "rsa_pss_rsae_sha384",
  "rsa_pkcs1_sha384",
  "rsa_pss_rsae_sha512",
  "rsa_pkcs1_sha512",
  "rsa_pkcs1_sha1",
];

const HTTPS_AGENT = new https.Agent({
  ciphers: CIPHERS.join(":"),
  sigalgs: SIGALGS.join(":"),
  honorCipherOrder: true,
  minVersion: "TLSv1.3",
  rejectUnauthorized: false,
  keepAlive: false,
  maxSockets: 1,
});

// define proxy. credentials are loaded from .env file
const PROXY = {
  protocol: process.env.PROXY_PROTOCOL!,
  host: process.env.PROXY_HOST!,
  port: Number(process.env.PROXY_PORT!),
  auth: {
    username: process.env.PROXY_USERNAME!,
    password: process.env.PROXY_PASSWORD!,
  },
} satisfies AxiosProxyConfig;

async function request() {
  // request data
  const VALAPI_ENDPOINT = "https://auth.riotgames.com/api/v1/authorization";

  const VALAPI_HEADERS = new AxiosHeaders();
  VALAPI_HEADERS.setContentType("application/json");
  VALAPI_HEADERS.setUserAgent(
    "RiotClient/87.0.2.1547.3551 rso-auth (Windows;10;;Professional, x64)"
  );

  const VALAPI_BODY = {
    client_id: "play-valorant-web-prod",
    nonce: "1",
    redirect_uri: "https://playvalorant.com/opt_in",
    response_type: "token id_token",
    scope: "account openid",
  };

  // create request
  const config = {
    proxy: PROXY,
    headers: VALAPI_HEADERS,
    httpsAgent: HTTPS_AGENT,
  } satisfies AxiosRequestConfig;

  const data = await axios.post(VALAPI_ENDPOINT, VALAPI_BODY, config);

  console.log(data);

  return data;
}

request();
