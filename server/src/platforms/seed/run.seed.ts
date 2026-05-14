import { platforms } from "../registry/platform.registry.ts";
import { seedPlatforms } from "./platform.seed.ts";

try {
  await seedPlatforms(platforms);
  console.log("Platform seeding completed");
} catch (error) {
  console.error("Platform seeding failed:", error);
}