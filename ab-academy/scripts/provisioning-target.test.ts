import assert from "node:assert/strict";
import test from "node:test";
import { verifyExpectedNeonTarget } from "./provisioning-target";

const productionBranch = {
  id: "br-round-king-ape40wuo",
  name: "production",
  project_id: "weathered-hat-33636279",
  primary: true,
  default: true,
};

const productionEndpoint = {
  id: "ep-ancient-union-ap3kuot0",
  host: "ep-ancient-union-ap3kuot0.c-7.us-east-1.aws.neon.tech",
  branch_id: productionBranch.id,
  project_id: productionBranch.project_id,
  hosts: {
    read_write_host: "ep-ancient-union-ap3kuot0.c-7.us-east-1.aws.neon.tech",
    read_write_pooled_host: "ep-ancient-union-ap3kuot0-pooler.c-7.us-east-1.aws.neon.tech",
  },
};

test("accepts the verified production branch and endpoint", () => {
  const result = verifyExpectedNeonTarget({
    databaseUrl: "postgresql://user:secret@ep-ancient-union-ap3kuot0-pooler.c-7.us-east-1.aws.neon.tech/neondb",
    directUrl: "postgresql://user:secret@ep-ancient-union-ap3kuot0.c-7.us-east-1.aws.neon.tech/neondb",
    branch: productionBranch,
    endpoints: [productionEndpoint],
  });

  assert.equal(result.branchName, "production");
  assert.equal(result.databaseName, "neondb");
});

test("rejects a rehearsal branch even when the caller claims production", () => {
  assert.throws(
    () =>
      verifyExpectedNeonTarget({
        databaseUrl: "postgresql://user:secret@ep-holy-fog-aprgx6ec-pooler.c-7.us-east-1.aws.neon.tech/neondb",
        directUrl: "postgresql://user:secret@ep-holy-fog-aprgx6ec.c-7.us-east-1.aws.neon.tech/neondb",
        branch: {
          ...productionBranch,
          id: "br-damp-salad-apvnfvne",
          name: "rehearsal/chapter-2-2026-10-02",
        },
        endpoints: [
          {
            ...productionEndpoint,
            id: "ep-holy-fog-aprgx6ec",
            host: "ep-holy-fog-aprgx6ec.c-7.us-east-1.aws.neon.tech",
            branch_id: "br-damp-salad-apvnfvne",
            hosts: {
              read_write_host: "ep-holy-fog-aprgx6ec.c-7.us-east-1.aws.neon.tech",
              read_write_pooled_host: "ep-holy-fog-aprgx6ec-pooler.c-7.us-east-1.aws.neon.tech",
            },
          },
        ],
      }),
    /not the protected production Neon branch/
  );
});
