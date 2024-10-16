import dotenv from 'dotenv';
const result = dotenv.config({
  path: '.env',
});

export default {
  // EXPRESS (SERVER INFO)
  SERVER_PORT: result.parsed?.SERVER_PORT,

  // MONGODB (DATABASE INFO)
  DATABASE_NAME: result.parsed?.DATABASE_NAME,
  DATABASE_USER: result.parsed?.DATABASE_USER,
  DATABASE_PASSWORD: result.parsed?.DATABASE_PASSWORD,
  DATABASE_HOST: result.parsed?.DATABASE_HOST,

  // JSON WEB TOKEN
  // Para modificar, utilize a seguinte ferramenta: https://randomkeygen.com/ na sessão CodeIgniter Encryption Keys
  JWT_PRIVATE_KEY: result.parsed?.JWT_PRIVATE_KEY,

  // CLIENTS
  PLATFORM_URL: result.parsed?.PLATFORM_URL,

  // ADMIN
  LOGIN: result.parsed?.LOGIN,
  PASSWORD: result.parsed?.PASSWORD,

  // CLOUDINARY
  // CLOUDINARY_CLOUD_NAME: result.parsed?.CLOUDINARY_CLOUD_NAME,
  // CLOUDINARY_API_KEY: result.parsed?.CLOUDINARY_API_KEY,
  // CLOUDINARY_SECRET: result.parsed?.CLOUDINARY_SECRET,
  // CLOUDINARY_URL: result.parsed?.CLOUDINARY_URL,

  //EMAIL
  SMTP_HOST: result.parsed?.SMTP_HOST,
  SMTP_PORT: result.parsed?.SMTP_PORT,
  SMTP_FROM: result.parsed?.SMTP_FROM,
  SMTP_USER: result.parsed?.SMTP_USER,
  SMTP_PASSWORD: result.parsed?.SMTP_PASSWORD,
};