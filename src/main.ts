import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "./pipes/validation.pipe";

const start = async () => {
  try {
    const PORT = process.env.PORT || 5000;
    const whitelist = ['http://localhost:3000/', 'https://shikin-links.tk/'];
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());
    
  //   app.enableCors({
  //     origin: function (origin, callback) {
  //   if (whitelist.indexOf(origin) !== -1) {
  //     callback(null, true);
  //   } else {
  //     callback(null, false);
  //   }
  // },
  //     methods: "GET,HEAD,PUT,POST,DELETE,OPTIONS",
  //     allowedHeaders: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe',
  //     credentials: true,
  //     exposedHeaders: ["set-cookie"],
  //   });
    app.enableCors({
      origin: "http://127.0.0.1:3000",
      credentials: true
    });
    app.useGlobalPipes(new ValidationPipe());

    await app.listen(PORT, () => console.log(`SERVER START ON PORT: ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
