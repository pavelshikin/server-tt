import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "./pipes/validation.pipe";

const start = async () => {
  try {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());
   var whitelist = ['https://react-zp9giu.stackblitz.io/', 'https://shikin-links.tk/'];
    app.enableCors({
      origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
      methods: "GET,HEAD,PUT,POST,DELETE,OPTIONS",
      allowedHeaders: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe',
      credentials: true,
      exposedHeaders: ["set-cookie"],
    });
    app.useGlobalPipes(new ValidationPipe());

    await app.listen(PORT, () => console.log(`SERVER START ON PORT: ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
