import { Controller, Get } from "@nestjs/common";

@Controller("/")
export class AppController {
   constructor() {
   }

   @Get()
   get() {
      return `<div style="text-align: center">
                  <h1 style="padding-top: 10%">Techno Train API</h1>
               </div>`;
   }
}
