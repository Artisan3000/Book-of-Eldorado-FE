export const EXPECTED_NEON_PROJECT_ID = "weathered-hat-33636279";
export const EXPECTED_NEON_BRANCH_ID = "br-round-king-ape40wuo";
export const EXPECTED_NEON_BRANCH_NAME = "production";

export type NeonEndpointMetadata = {
  id: string;
  host: string;
  branch_id: string;
  project_id: string;
  hosts?: {
    read_write_host?: string;
    read_write_pooled_host?: string;
  };
};

export type NeonBranchMetadata = {
  id: string;
  name: string;
  project_id: string;
  primary?: boolean;
  default?: boolean;
};

function connectionHost(value: string, name: string) {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${name} must be a valid database URL.`);
  }

  if (url.protocol !== "postgresql:" && url.protocol !== "postgres:") {
    throw new Error(`${name} must use PostgreSQL.`);
  }

  return { host: url.hostname, database: url.pathname.slice(1) };
}

function endpointMatchesHost(endpoint: NeonEndpointMetadata, host: string) {
  return [
    endpoint.host,
    endpoint.hosts?.read_write_host,
    endpoint.hosts?.read_write_pooled_host,
  ].some((candidate) => candidate === host);
}

export function verifyExpectedNeonTarget({
  databaseUrl,
  directUrl,
  branch,
  endpoints,
}: {
  databaseUrl: string;
  directUrl: string;
  branch: NeonBranchMetadata;
  endpoints: NeonEndpointMetadata[];
}) {
  const database = connectionHost(databaseUrl, "DATABASE_URL");
  const direct = connectionHost(directUrl, "DIRECT_URL");
  const databaseEndpoint = endpoints.find((endpoint) =>
    endpointMatchesHost(endpoint, database.host)
  );
  const directEndpoint = endpoints.find((endpoint) =>
    endpointMatchesHost(endpoint, direct.host)
  );

  if (!databaseEndpoint || !directEndpoint) {
    throw new Error("Refusing to provision: database endpoint is not registered in the expected Neon project.");
  }

  if (
    branch.id !== EXPECTED_NEON_BRANCH_ID ||
    branch.name !== EXPECTED_NEON_BRANCH_NAME ||
    branch.project_id !== EXPECTED_NEON_PROJECT_ID ||
    databaseEndpoint.project_id !== EXPECTED_NEON_PROJECT_ID ||
    directEndpoint.project_id !== EXPECTED_NEON_PROJECT_ID ||
    databaseEndpoint.branch_id !== EXPECTED_NEON_BRANCH_ID ||
    directEndpoint.branch_id !== EXPECTED_NEON_BRANCH_ID
  ) {
    throw new Error("Refusing to provision: effective database target is not the protected production Neon branch.");
  }

  if (database.database !== direct.database) {
    throw new Error("Refusing to provision: DATABASE_URL and DIRECT_URL target different databases.");
  }

  return {
    projectId: branch.project_id,
    branchId: branch.id,
    branchName: branch.name,
    databaseEndpointId: databaseEndpoint.id,
    databaseHost: database.host,
    directHost: direct.host,
    databaseName: database.database,
  };
}
