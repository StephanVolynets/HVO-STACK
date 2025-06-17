import { Injectable, OnModuleInit } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisTestService implements OnModuleInit {
  private redisClient: Redis;

  async onModuleInit() {
    this.redisClient = new Redis({
      host: "127.0.0.1",
      port: 6379,
    });

    try {
      const result = await this.redisClient.ping();
      console.log("Redis connected:", result); // Should log "PONG"
    } catch (error) {
      console.error("Redis connection error:", error.message);
    }
  }
}
