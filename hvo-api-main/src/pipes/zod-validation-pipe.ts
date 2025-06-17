// import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
// import { ZodSchema, ZodError } from "zod";

// @Injectable()
// export class ZodValidationPipe implements PipeTransform {
//   constructor(private schema: ZodSchema<any>) {}

//   transform(value: any) {
//     try {
//       return this.schema.parse(value); // Parse and validate data with Zod
//     } catch (e) {
//       if (e instanceof ZodError) {
//         throw new BadRequestException(e.errors); // Handle validation errors
//       }
//       throw new BadRequestException("Validation failed");
//     }
//   }
// }
