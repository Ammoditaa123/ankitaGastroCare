import type { NextConfig } from "next";
import { loadEnvConfig } from "@next/env";

// Manually load env variables from the project directory
loadEnvConfig(process.cwd());

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
