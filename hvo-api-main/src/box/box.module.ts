import { Module } from "@nestjs/common";
import { BoxService } from "./box.service";
import { IBoxService } from "./box.service.interface";
import { BoxController } from "./box.controller";
import { BoxInitializerService } from "./box-initializer.service";

// @Module({
//   controllers: [BoxController],
//   // imports: [BoxInitializerService],
//   providers: [
//     {
//       provide: IBoxService,
//       useClass: BoxService,
//     },
//     BoxService,
//     BoxInitializerService,
//   ],
//   exports: [IBoxService],
// })
// export class BoxModule {}
