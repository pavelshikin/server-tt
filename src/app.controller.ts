import { Controller, Get } from "@nestjs/common";

@Controller("/")
export class AppController {
  constructor() {
  }

  @Get()
  get() {
    return `<div style="text-align: center">
                  <h1>Techno train API</h1>
              </div>`;
  }
}