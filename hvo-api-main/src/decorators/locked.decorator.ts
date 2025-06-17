import { SetMetadata } from "@nestjs/common";

export const IS_LOCKED_KEY = "isPublic";

export const Locked = () => SetMetadata(IS_LOCKED_KEY, true);
