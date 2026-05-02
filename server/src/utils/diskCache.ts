import fs from "fs/promises";
import path from "path";
import { getErrorMessage } from "./errors.js";

type DiskCacheOptions<T> = {
  filePath: string;
  isValid: (value: unknown) => value is T;
};

export const readDiskCache = async <T>({
  filePath,
  isValid,
}: DiskCacheOptions<T>): Promise<T | null> => {
  try {
    const cache = JSON.parse(await fs.readFile(filePath, "utf8")) as unknown;
    return isValid(cache) ? cache : null;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== "ENOENT") {
      console.warn("Disk cache read failed:", getErrorMessage(error));
    }

    return null;
  }
};

export const writeDiskCache = async <T>(
  filePath: string,
  cache: T,
): Promise<void> => {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(cache), "utf8");
  } catch (error) {
    console.warn("Disk cache write failed:", getErrorMessage(error));
  }
};
