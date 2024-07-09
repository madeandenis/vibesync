import { config } from 'dotenv';
config();

interface IAppConfig {
  general: {
    nodeEnv: string;
    port: number;
    host: string;
    frontendBaseUrl: string;
    backendBaseUrl: string;
    appName: string;
    appVersion: string;
  };
  auth: {
    jwtSecret: string;
    jwtExpiresIn: number;
  };
  security: {
    corsOrigin: string;
    rateLimit: number;
  };
  featureFlags: {
    featureX: boolean;
    maintenanceMode: boolean;
  };
  miscellaneous: {
    appTheme: string;
    defaultLanguage: string;
  };
}

const AppConfig: IAppConfig = {
  general: {
    nodeEnv: process.env.NODE_ENV,
    port: Number(process.env.PORT),
    host: process.env.HOST,
    frontendBaseUrl: process.env.FRONTEND_BASE_URL,
    backendBaseUrl: process.env.BACKEND_BASE_URL,
    appName: process.env.APP_NAME,
    appVersion: process.env.APP_VERSION,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: Number(process.env.jwtExpiresIn),
  },
  security: {
    corsOrigin: process.env.CORS_ORIGIN,
    rateLimit: Number(process.env.RATE_LIMIT),
  },
  featureFlags: {
    featureX: process.env.FEATURE_FLAG_X === 'true',
    maintenanceMode: process.env.MAINTENANCE_MODE === 'true',
  },
  miscellaneous: {
    appTheme: process.env.APP_THEME,
    defaultLanguage: process.env.DEFAULT_LANGUAGE,
  },
};

export default AppConfig;
