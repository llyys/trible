import { Get, Controller } from "~/server/decorators/Controller";

@Controller("/api")
export class ApiController {
  @Get("/")
  index(req, res){
    res.send("welcome to api");
  }
}