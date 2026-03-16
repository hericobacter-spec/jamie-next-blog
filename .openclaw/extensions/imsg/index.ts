import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

type Ctx = {
  args?: string;
  config?: any;
};

function usage() {
  return (
    "Usage:\n" +
    "/imsg send <to> <text>\n" +
    "/imsg chats [limit]\n" +
    "/imsg history <chatId> [limit]\n" +
    "\nExamples:\n" +
    "/imsg send +821012345678 안녕하세요\n" +
    "/imsg chats 5\n" +
    "/imsg history 1 20"
  );
}

function getImsgPath(ctx: Ctx) {
  return (
    ctx?.config?.plugins?.entries?.imsg?.config?.imsgPath ||
    ctx?.config?.plugins?.entries?.imsg?.imsgPath ||
    "/Users/jamie/.local/bin/imsg"
  );
}

function splitArgs(raw?: string) {
  const s = (raw ?? "").trim();
  if (!s) return [];
  // keep it simple: whitespace split
  return s.split(/\s+/);
}

export default function (api: any) {
  api.registerCommand({
    name: "imsg",
    description: "Send/read iMessage/SMS via imsg CLI",
    acceptsArgs: true,
    requireAuth: true,
    handler: async (ctx: Ctx) => {
      const argv = splitArgs(ctx.args);
      if (!argv.length) return { text: usage() };

      const cmd = argv[0]?.toLowerCase();
      const imsgPath = getImsgPath(ctx);

      try {
        if (cmd === "send") {
          const to = argv[1];
          const text = argv.slice(2).join(" ");
          if (!to || !text) return { text: usage() };
          await execFileAsync(imsgPath, [
            "send",
            "--to",
            to,
            "--text",
            text,
            "--service",
            "auto",
          ]);
          return { text: `OK: sent to ${to}` };
        }

        if (cmd === "chats") {
          const limit = argv[1] ?? "10";
          const { stdout } = await execFileAsync(imsgPath, [
            "chats",
            "--limit",
            String(limit),
          ]);
          return { text: stdout.trim() || "(no output)" };
        }

        if (cmd === "history") {
          const chatId = argv[1];
          const limit = argv[2] ?? "20";
          if (!chatId) return { text: usage() };
          const { stdout } = await execFileAsync(imsgPath, [
            "history",
            "--chat-id",
            String(chatId),
            "--limit",
            String(limit),
          ]);
          return { text: stdout.trim() || "(no output)" };
        }

        return { text: `Unknown subcommand: ${cmd}\n\n` + usage() };
      } catch (e: any) {
        const msg = e?.stderr || e?.stdout || e?.message || String(e);
        return { text: `imsg 실행 실패: ${msg}` };
      }
    },
  });
}
