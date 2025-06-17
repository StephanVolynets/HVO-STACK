import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import * as os from "os";

@Injectable()
export class UploadProgressInterceptor implements NestInterceptor {
  private readonly logger = new Logger(UploadProgressInterceptor.name);
  private readonly memoryThreshold = 85; // Alert if memory usage is above 85%

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const file = request.file;
    const startTime = Date.now();
    const initialMemory = this.getMemoryUsage();

    if (file) {
      const fileSize = file.size;
      const fileName = file.originalname;

      // Initial upload stats
      const stats = {
        fileName,
        fileSize: this.formatBytes(fileSize),
        startTime,
        initialMemoryUsage: initialMemory,
        contentType: file.mimetype,
      };

      this.logger.log(`
Upload Started:
- File: ${stats.fileName}
- Size: ${stats.fileSize}
- Type: ${stats.contentType}
- Initial Memory Usage: ${stats.initialMemoryUsage}%`);

      return next.handle().pipe(
        tap({
          next: () => {
            const endTime = Date.now();
            const duration = endTime - startTime;
            const finalMemory = this.getMemoryUsage();
            const memoryDiff = finalMemory - initialMemory;
            const speedMBps = fileSize / 1024 / 1024 / (duration / 1000);

            // Check if memory usage is concerning
            if (finalMemory > this.memoryThreshold) {
              this.logger.warn(`High memory usage detected: ${finalMemory}%`);
            }

            this.logger.log(`
Upload Completed:
- File: ${fileName}
- Size: ${this.formatBytes(fileSize)}
- Duration: ${this.formatDuration(duration)}
- Speed: ${speedMBps.toFixed(2)} MB/s
- Memory Impact: ${memoryDiff > 0 ? "+" : ""}${memoryDiff.toFixed(2)}%
- Final Memory Usage: ${finalMemory}%`);
          },
          error: (error) => {
            const endTime = Date.now();
            const duration = endTime - startTime;
            const finalMemory = this.getMemoryUsage();
            const memoryDiff = finalMemory - initialMemory;

            this.logger.error(`
Upload Failed:
- File: ${fileName}
- Size: ${this.formatBytes(fileSize)}
- Duration Before Failure: ${this.formatDuration(duration)}
- Memory Impact: ${memoryDiff > 0 ? "+" : ""}${memoryDiff.toFixed(2)}%
- Error: ${error.message}
- Stack: ${error.stack}`);
          },
        })
      );
    }

    return next.handle();
  }

  private getMemoryUsage(): number {
    const used = process.memoryUsage();
    const totalMemory = os.totalmem();
    return Math.round((used.heapUsed / totalMemory) * 100);
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  private formatDuration(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    const seconds = ms / 1000;
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(1);
    return `${minutes}m ${remainingSeconds}s`;
  }
}
