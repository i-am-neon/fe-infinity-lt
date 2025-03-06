/**
 * Returns true if running in an Electron environment.
 */
export function isElectronEnvironment(): boolean {
  return (
    Deno.env.get("ELECTRON_RUN_AS_NODE") === "1" ||
    typeof Deno.env.get("ELECTRON_APP_ROOT") !== "undefined" ||
    typeof Deno.env.get("SERVER_DIR") !== "undefined"
  );
}

/**
 * Returns true if PostgreSQL might be available in the current environment.
 */
export async function isPostgresAvailable(): Promise<boolean> {
  try {
    // Try to connect to PostgreSQL
    const process = new Deno.Command("psql", {
      args: ["--version"],
      stdout: "null",
      stderr: "null",
    });
    const status = await process.output();
    return status.code === 0;
  } catch (e) {
    // If command fails, PostgreSQL is likely not available
    return false;
  }
}

/**
 * Returns a description of the current environment.
 */
export function getEnvironmentDescription(): string {
  const environment = [];

  if (isElectronEnvironment()) {
    environment.push("Electron");
  } else {
    environment.push("Standalone");
  }

  if (Deno.env.get("NODE_ENV") === "production" ||
      Deno.env.get("DENO_ENV") === "production") {
    environment.push("Production");
  } else {
    environment.push("Development");
  }

  environment.push(`OS: ${Deno.build.os}`);

  return environment.join(", ");
}

if (import.meta.main) {
  console.log(`Environment: ${getEnvironmentDescription()}`);
  isPostgresAvailable().then(available => {
    console.log(`PostgreSQL available: ${available}`);
  });
}