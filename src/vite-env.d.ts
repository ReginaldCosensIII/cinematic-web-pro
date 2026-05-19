/// <reference types="vite/client" />

declare const process: { env: { NODE_ENV: 'development' | 'production' | 'test' } };

declare namespace NodeJS {
  type Timeout = ReturnType<typeof setTimeout>;
}
