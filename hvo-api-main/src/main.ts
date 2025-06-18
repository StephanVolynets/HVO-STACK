import { NestFactory } from "@nestjs/core";
import { credential } from "firebase-admin";
import { applicationDefault, initializeApp, ServiceAccount } from "firebase-admin/app";
import { readFile } from "fs/promises";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as bodyParser from "body-parser";
import express from "express";

const PORT = 8080;
const APP_ENV = process.env.APP_ENV;
const STORAGE_BUCKET = process.env.STORAGE_BUCKET;
const CLIENT_URL = process.env.CLIENT_URL;
const ADMIN_CLIENT_URL = process.env.ADMIN_CLIENT_URL;

const readServiceAccount = async () => JSON.parse(await readFile("service-account-dev.json", "utf8"));

export const getApp = async () => {
  const serviceAccount = APP_ENV === "local" ? await readServiceAccount() : null;

  initializeApp({
    storageBucket: STORAGE_BUCKET,
    credential: APP_ENV === "local" ? credential.cert(serviceAccount as ServiceAccount) : applicationDefault(),
  });
  
  const origin = APP_ENV === "local" ? /http:\/\/localhost:[0-9]{4,5}/ : [CLIENT_URL, ADMIN_CLIENT_URL];

  const app = await NestFactory.create(AppModule, {
    // cors: {
    //   credentials: true,
    //   origin,
    // },
    cors: {
      origin: "*",
      credentials: true,
    },
  });

  const config = new DocumentBuilder()
    .setTitle("HVO API")
    .setDescription("The HVO API")
    .setVersion("1.0")
    .addTag("hvo")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  app.setGlobalPrefix("api");
  return app;
};

const bootstrap = async () => {
  const app = await getApp();

  await app.listen(PORT);
};

bootstrap();
