import { Global, Module } from "@nestjs/common";
import { PubSub } from "@google-cloud/pubsub";
import { PubSubService } from "./pubsub.service";

// @Global() // If its global, you dont have to import in other modules
@Module({
  //   providers: [
  //     {
  //       provide: "PUB_SUB",
  //       useValue: new PubSub(), // Initialize PubSub here
  //     },
  //   ],
  //   exports: ["PUB_SUB"], // Export for use in other modules
  providers: [PubSubService],
  exports: [PubSubService],
})
export class PubSubModule {}
