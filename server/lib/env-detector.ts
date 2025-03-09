// Add type declaration to extend Deno namespace
declare global {
  namespace Deno {
    // deno-lint-ignore no-explicit-any
    var electronAPI: any;
  }
}

/**
 * Returns true if running in an Electron environment.
 */
export function isElectronEnvironment(): boolean {
  return (
    Deno.env.get("ELECTRON_RUN_AS_NODE") === "1" ||
    typeof Deno.env.get("ELECTRON_APP_ROOT") !== "undefined" ||
    typeof Deno.env.get("SERVER_DIR") !== "undefined" ||
    typeof Deno.electronAPI !== "undefined"
  );
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

  if (
    Deno.env.get("NODE_ENV") === "production" ||
    Deno.env.get("DENO_ENV") === "production"
  ) {
    environment.push("Production");
  } else {
    environment.push("Development");
  }

  environment.push(`OS: ${Deno.build.os}`);

  return environment.join(", ");
}

