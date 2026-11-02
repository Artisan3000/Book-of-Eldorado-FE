import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { Prisma, PrismaClient, Role } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";
import {
  EXPECTED_NEON_PROJECT_ID,
  EXPECTED_NEON_BRANCH_ID,
  verifyExpectedNeonTarget,
  type NeonBranchMetadata,
  type NeonEndpointMetadata,
} from "./provisioning-target";

const CHRISTINE_EMAIL = "christineashleyforbes@gmail.com";
const MIN_PASSWORD_LENGTH = 8;
const prisma = new PrismaClient();

async function assertProductionTarget() {
  if (process.env.EMPLOYEE_PROVISION_TARGET !== "production") {
    throw new Error(
      "Refusing to provision: set EMPLOYEE_PROVISION_TARGET=production explicitly."
    );
  }

  if (process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development") {
    throw new Error("Refusing to provision against a test or development runtime.");
  }

  const databaseUrl = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;
  const neonApiKey = process.env.NEON_API_KEY;
  if (!databaseUrl || !directUrl) {
    throw new Error("DATABASE_URL and DIRECT_URL are required for production target verification.");
  }
  if (!neonApiKey) {
    throw new Error("NEON_API_KEY is required to verify the production branch independently.");
  }

  const headers = { Authorization: `Bearer ${neonApiKey}` };
  const [branchResponse, endpointsResponse] = await Promise.all([
    fetch(`https://console.neon.tech/api/v2/projects/${EXPECTED_NEON_PROJECT_ID}/branches/${EXPECTED_NEON_BRANCH_ID}`, { headers, signal: AbortSignal.timeout(10_000) }),
    fetch(`https://console.neon.tech/api/v2/projects/${EXPECTED_NEON_PROJECT_ID}/endpoints`, { headers, signal: AbortSignal.timeout(10_000) }),
  ]);
  if (!branchResponse.ok || !endpointsResponse.ok) {
    throw new Error("Refusing to provision: Neon production target verification failed.");
  }

  const branchPayload = (await branchResponse.json()) as { branch?: NeonBranchMetadata };
  const branch = branchPayload.branch;
  const endpointPayload = (await endpointsResponse.json()) as { endpoints?: NeonEndpointMetadata[] };
  if (!branch) {
    throw new Error("Refusing to provision: Neon returned no branch identity.");
  }
  const target = verifyExpectedNeonTarget({
    databaseUrl,
    directUrl,
    branch,
    endpoints: endpointPayload.endpoints ?? [],
  });

  console.log(JSON.stringify({ verifiedProductionTarget: target }));
  return target;
}

async function promptHidden(question: string) {
  const terminalInput = input as typeof input & {
    isRaw?: boolean;
    setRawMode?: (mode: boolean) => void;
  };
  const wasRaw = terminalInput.isRaw ?? false;
  let value = "";

  output.write(question);
  terminalInput.setRawMode?.(true);
  terminalInput.resume();

  try {
    await new Promise<void>((resolve, reject) => {
      const onData = (chunk: Buffer) => {
        for (const byte of chunk) {
          if (byte === 3) {
            reject(new Error("Provisioning canceled."));
            return;
          }
          if (byte === 13 || byte === 10) {
            terminalInput.removeListener("data", onData);
            output.write("\n");
            resolve();
            return;
          }
          if (byte === 127 || byte === 8) {
            value = value.slice(0, -1);
            continue;
          }
          value += String.fromCharCode(byte);
        }
      };

      terminalInput.on("data", onData);
    });
  } finally {
    terminalInput.setRawMode?.(wasRaw);
    terminalInput.pause();
  }

  return value;
}

async function main() {
  await assertProductionTarget();

  const emailFlag = process.argv.indexOf("--email");
  const email = emailFlag >= 0 ? process.argv[emailFlag + 1]?.trim().toLowerCase() : "";
  if (email !== CHRISTINE_EMAIL) {
    throw new Error(`Refusing to provision: use --email ${CHRISTINE_EMAIL}.`);
  }

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, role: true, isActive: true },
  });
  if (existing) {
    throw new Error(
      `Refusing to overwrite existing user ${existing.email} (${existing.role}, active=${existing.isActive}).`
    );
  }

  const readline = createInterface({ input, output });
  const name = (await readline.question("Christine's display name: ")).trim();
  readline.close();
  if (!name) throw new Error("Display name is required.");

  let password = await promptHidden("Initial password (hidden): ");
  const confirmation = await promptHidden("Confirm initial password (hidden): ");
  if (password.length < MIN_PASSWORD_LENGTH) {
    password = "";
    throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }
  if (password !== confirmation) {
    password = "";
    throw new Error("Passwords do not match.");
  }

  const passwordHash = await hashPassword(password);
  password = "";

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: Role.EMPLOYEE,
        isActive: true,
      },
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });

    console.log(
      JSON.stringify({
        provisioned: true,
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        enrollmentCreated: false,
      })
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new Error("Refusing to overwrite: the email became associated with a user during provisioning.");
    }
    throw error;
  }
}

main()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : "Provisioning failed.");
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
