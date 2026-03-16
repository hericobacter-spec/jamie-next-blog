type Ctx = {
  channel?: string;
  senderId?: string;
  isAuthorizedSender?: boolean;
  args?: string;
  commandBody?: string;
  config?: any;
};

function getEnv(ctx: Ctx, key: string): string | undefined {
  return ctx?.config?.env?.vars?.[key] ?? ctx?.config?.resolved?.env?.vars?.[key];
}

function usage() {
  return (
    "Usage:\n" +
    "/ha toggle <entity_id>\n" +
    "/ha on <entity_id>\n" +
    "/ha off <entity_id>\n" +
    "/ha state <entity_id>\n" +
    "/ha temp <climate_entity_id> <21-26>\n" +
    "/ha open <valve_entity_id>\n" +
    "/ha close <valve_entity_id>\n" +
    "\nExample: /ha toggle switch.geosil1"
  );
}

function parseArgs(raw?: string) {
  const s = (raw ?? "").trim();
  if (!s) return { action: "", entityId: "", value: "" };
  const [action, entityId, ...rest] = s.split(/\s+/);
  return {
    action: (action ?? "").toLowerCase(),
    entityId: (entityId ?? "").trim(),
    value: rest.join(" ").trim(),
  };
}

function ensureEntity(entityId: string) {
  if (!entityId) return { ok: false as const, error: "Missing entity_id.\n\n" + usage() };
  if (!/^[a-zA-Z0-9_]+\.[a-zA-Z0-9_]+$/.test(entityId)) {
    return {
      ok: false as const,
      error: `Invalid entity_id: ${entityId}\nExpected like: switch.geosil1`,
    };
  }
  return { ok: true as const };
}

function domainOf(entityId: string) {
  return entityId.split(".")[0];
}

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.replace(/\/+$/, "");
}

async function haFetch(ctx: Ctx, init: { method: string; path: string; body?: any }) {
  const baseUrl = getEnv(ctx, "HA_BASE_URL");
  const token = getEnv(ctx, "HA_TOKEN");
  if (!baseUrl || !token) {
    return {
      ok: false as const,
      error:
        "HA 연결정보가 없습니다. openclaw.json env.vars에 HA_BASE_URL / HA_TOKEN을 설정해야 합니다.",
    };
  }

  const url = normalizeBaseUrl(baseUrl) + init.path;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  let res: Response;
  try {
    res = await fetch(url, {
      method: init.method,
      headers,
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
    });
  } catch (e: any) {
    return { ok: false as const, error: `HA 요청 실패(네트워크): ${e?.message ?? String(e)}` };
  }

  const text = await res.text().catch(() => "");
  let json: any = undefined;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      // ignore
    }
  }

  if (!res.ok) {
    const extra = json ? JSON.stringify(json) : text;
    return {
      ok: false as const,
      error: `HA 요청 실패: HTTP ${res.status} ${res.statusText}${extra ? `\n${extra}` : ""}`,
    };
  }

  return { ok: true as const, status: res.status, json, text };
}

export default function (api: any) {
  api.registerCommand({
    name: "ha",
    description: "Home Assistant quick control (toggle/on/off/state)",
    acceptsArgs: true,
    requireAuth: true,
    handler: async (ctx: Ctx) => {
      const { action, entityId, value } = parseArgs(ctx.args);

      if (!action) return { text: usage() };

      if (action === "help") return { text: usage() };

      const ent = ensureEntity(entityId);
      if (!ent.ok) return { text: ent.error };

      if (action === "state") {
        const r = await haFetch(ctx, { method: "GET", path: `/api/states/${entityId}` });
        if (!r.ok) return { text: r.error };
        const state = r.json?.state ?? "(unknown)";
        const attrs = r.json?.attributes ?? {};
        const friendly = attrs.friendly_name;
        const dom = domainOf(entityId);

        if (dom === "climate") {
          const cur = attrs.current_temperature;
          const target = attrs.temperature;
          const minT = attrs.min_temp;
          const maxT = attrs.max_temp;
          return {
            text:
              `${entityId}${friendly ? ` (${friendly})` : ""}\n` +
              `- mode: ${state}\n` +
              `- 현재온도: ${cur ?? "?"}°C\n` +
              `- 목표온도: ${target ?? "?"}°C` +
              (minT !== undefined && maxT !== undefined ? `\n- 범위: ${minT}~${maxT}°C` : ""),
          };
        }

        const unit = attrs.unit_of_measurement;
        return { text: `${entityId}${friendly ? ` (${friendly})` : ""}: ${state}${unit ? ` ${unit}` : ""}` };
      }

      if (action === "temp") {
        // Expect climate.<name> and numeric value
        const n = Number(value);
        if (!Number.isFinite(n)) {
          return { text: `온도 값이 필요합니다.\n\n` + usage() };
        }
        const dom = domainOf(entityId);
        if (dom !== "climate") {
          return { text: `temp는 climate 엔티티만 지원합니다: ${entityId}` };
        }
        const r = await haFetch(ctx, {
          method: "POST",
          path: `/api/services/climate/set_temperature`,
          body: { entity_id: entityId, temperature: n },
        });
        if (!r.ok) return { text: r.error };
        const s = await haFetch(ctx, { method: "GET", path: `/api/states/${entityId}` });
        if (s.ok) {
          const cur = s.json?.attributes?.temperature;
          const st = s.json?.state;
          return { text: `OK: temp ${entityId} → ${cur ?? "?"} (state=${st ?? "?"})` };
        }
        return { text: `OK: temp ${entityId} → ${n}` };
      }

      if (action === "open" || action === "close") {
        const dom = domainOf(entityId);
        if (dom !== "valve") {
          return { text: `${action}은 valve 엔티티만 지원합니다: ${entityId}` };
        }
        const svc = action === "open" ? "open_valve" : "close_valve";
        const r = await haFetch(ctx, {
          method: "POST",
          path: `/api/services/valve/${svc}`,
          body: { entity_id: entityId },
        });
        if (!r.ok) return { text: r.error };
        const s = await haFetch(ctx, { method: "GET", path: `/api/states/${entityId}` });
        if (s.ok) {
          const st = s.json?.state ?? "(unknown)";
          return { text: `OK: ${action} ${entityId} → ${st}` };
        }
        return { text: `OK: ${action} ${entityId}` };
      }

      let service: string | undefined;
      if (action === "toggle") service = "toggle";
      if (action === "on") service = "turn_on";
      if (action === "off") service = "turn_off";

      if (!service) {
        return { text: `Unknown action: ${action}\n\n` + usage() };
      }

      const domain = domainOf(entityId);
      const r = await haFetch(ctx, {
        method: "POST",
        path: `/api/services/${domain}/${service}`,
        body: { entity_id: entityId },
      });
      if (!r.ok) return { text: r.error };

      // Optional follow-up state read (best-effort)
      const s = await haFetch(ctx, { method: "GET", path: `/api/states/${entityId}` });
      if (s.ok) {
        const state = s.json?.state ?? "(unknown)";
        return { text: `OK: ${action} ${entityId} → ${state}` };
      }

      return { text: `OK: ${action} ${entityId}` };
    },
  });
}
