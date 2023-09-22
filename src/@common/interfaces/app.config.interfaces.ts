export interface AppConfig {
  server: {
    port: number;
  };
  jwt: {
    secret: string;
  };
}
