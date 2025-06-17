import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import * as os from "os";

@Injectable()
export class AdvancedUploadProgressInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AdvancedUploadProgressInterceptor.name);
  private readonly memoryThreshold = 85; // Alert if memory usage is above 85%
  private readonly cpuThreshold = 80; // Alert if CPU usage is above 80%

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const file = request.file;
    const startTime = Date.now();
    const initialMemory = this.getMemoryUsage();
    const initialCpu = this.getCpuUsage();
    const initialSystemLoad = os.loadavg()[0];

    if (file) {
      const fileSize = file.size;
      const fileName = file.originalname;

      // File validation metrics
      const fileValidation = {
        hasValidExtension: this.validateFileExtension(fileName),
        mimeType: file.mimetype,
        isValidMimeType: this.validateMimeType(file.mimetype),
        bufferEncoding: file.encoding,
      };

      // System metrics
      const systemMetrics = {
        platform: process.platform,
        nodeVersion: process.version,
        cpuCores: os.cpus().length,
        totalMemory: this.formatBytes(os.totalmem()),
        freeMemory: this.formatBytes(os.freemem()),
        uptime: this.formatDuration(os.uptime() * 1000),
      };

      // Network metrics
      const networkInfo = {
        remoteAddress: request.ip,
        protocol: request.protocol,
        host: request.get("host"),
        userAgent: request.get("user-agent"),
      };

      this.logger.log(`
Upload Started:
- File Information:
  • Name: ${fileName}
  • Size: ${this.formatBytes(fileSize)}
  • Type: ${file.mimetype}
  • Encoding: ${file.encoding}
  • Valid Extension: ${fileValidation.hasValidExtension}
  • Valid MIME Type: ${fileValidation.isValidMimeType}

- System State:
  • Memory Usage: ${initialMemory}%
  • CPU Usage: ${initialCpu}%
  • System Load: ${initialSystemLoad.toFixed(2)}
  • Available Memory: ${systemMetrics.freeMemory}
  • CPU Cores: ${systemMetrics.cpuCores}
  • Platform: ${systemMetrics.platform}
  • Node Version: ${systemMetrics.nodeVersion}

- Network Information:
  • Client IP: ${networkInfo.remoteAddress}
  • Protocol: ${networkInfo.protocol}
  • Host: ${networkInfo.host}
  • User Agent: ${networkInfo.userAgent}`);

      return next.handle().pipe(
        tap({
          next: () => {
            const endTime = Date.now();
            const duration = endTime - startTime;
            const finalMemory = this.getMemoryUsage();
            const finalCpu = this.getCpuUsage();
            const finalSystemLoad = os.loadavg()[0];

            const memoryDiff = finalMemory - initialMemory;
            const cpuDiff = finalCpu - initialCpu;
            const loadDiff = finalSystemLoad - initialSystemLoad;
            const speedMBps = fileSize / 1024 / 1024 / (duration / 1000);

            // Performance metrics
            const performance = {
              averageSpeed: speedMBps,
              throughput: (fileSize / duration) * 1000, // bytes per second
              efficiency: this.calculateEfficiency(duration, fileSize),
            };

            // Check system health
            if (finalMemory > this.memoryThreshold) {
              this.logger.warn(`High memory usage detected: ${finalMemory}%`);
            }
            if (finalCpu > this.cpuThreshold) {
              this.logger.warn(`High CPU usage detected: ${finalCpu}%`);
            }

            this.logger.log(`
Upload Completed:
- File Metrics:
  • Name: ${fileName}
  • Size: ${this.formatBytes(fileSize)}
  • Duration: ${this.formatDuration(duration)}
  • Speed: ${speedMBps.toFixed(2)} MB/s
  • Throughput: ${this.formatBytes(performance.throughput)}/s
  • Processing Efficiency: ${performance.efficiency}%

- Resource Impact:
  • Memory Change: ${memoryDiff > 0 ? "+" : ""}${memoryDiff.toFixed(2)}%
  • CPU Impact: ${cpuDiff > 0 ? "+" : ""}${cpuDiff.toFixed(2)}%
  • Load Change: ${loadDiff > 0 ? "+" : ""}${loadDiff.toFixed(2)}
  • Final Memory Usage: ${finalMemory}%
  • Final CPU Usage: ${finalCpu}%
  • Final System Load: ${finalSystemLoad.toFixed(2)}

- System Health:
  • Available Memory: ${this.formatBytes(os.freemem())}
  • Memory Pressure: ${this.calculateMemoryPressure()}%
  • CPU Pressure: ${this.calculateCpuPressure()}%`);
          },
          error: (error) => {
            const endTime = Date.now();
            const duration = endTime - startTime;
            const finalMemory = this.getMemoryUsage();
            const finalCpu = this.getCpuUsage();
            const memoryDiff = finalMemory - initialMemory;
            const cpuDiff = finalCpu - initialCpu;

            this.logger.error(`
Upload Failed:
- Error Information:
  • Message: ${error.message}
  • Stack: ${error.stack}
  • Type: ${error.name}
  • Code: ${error.code || "N/A"}

- File Information:
  • Name: ${fileName}
  • Size: ${this.formatBytes(fileSize)}
  • Duration Before Failure: ${this.formatDuration(duration)}

- Resource Impact:
  • Memory Change: ${memoryDiff > 0 ? "+" : ""}${memoryDiff.toFixed(2)}%
  • CPU Impact: ${cpuDiff > 0 ? "+" : ""}${cpuDiff.toFixed(2)}%
  • Final Memory Usage: ${finalMemory}%
  • Final CPU Usage: ${finalCpu}%`);
          },
        })
      );
    }

    return next.handle();
  }

  private getCpuUsage(): number {
    const cpus = os.cpus();
    const totalCpu = cpus.reduce((acc, cpu) => {
      const total = Object.values(cpu.times).reduce((a, b) => a + b);
      const idle = cpu.times.idle;
      return acc + ((total - idle) / total) * 100;
    }, 0);
    return Math.round(totalCpu / cpus.length);
  }

  private calculateEfficiency(duration: number, fileSize: number): number {
    // Basic efficiency calculation based on expected vs actual duration
    const expectedThroughput = 50 * 1024 * 1024; // 50MB/s as baseline
    const expectedDuration = (fileSize / expectedThroughput) * 1000;
    return Math.min(100, Math.round((expectedDuration / duration) * 100));
  }

  private calculateMemoryPressure(): number {
    const free = os.freemem();
    const total = os.totalmem();
    return Math.round(((total - free) / total) * 100);
  }

  private calculateCpuPressure(): number {
    return Math.round((os.loadavg()[0] * 100) / os.cpus().length);
  }

  private validateFileExtension(fileName: string): boolean {
    const allowedExtensions = [".wav", ".mp3", ".mp4", ".avi", ".mov", ".pdf", ".doc", ".docx"];
    const ext = fileName.toLowerCase().slice(fileName.lastIndexOf("."));
    return allowedExtensions.includes(ext);
  }

  private validateMimeType(mimeType: string): boolean {
    const allowedMimeTypes = [
      "audio/wav",
      "audio/mpeg",
      "video/mp4",
      "video/avi",
      "video/quicktime",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    return allowedMimeTypes.includes(mimeType);
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
