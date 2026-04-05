import "dotenv/config";
import { Client, isFullPage } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = process.env.NOTION_DB_ID;
const DATA_SOURCE_ID = process.env.NOTION_DB_ID;
/** DB column for publish state (your schema uses `status` + select) */
const STATUS_PROPERTY =
  process.env.NOTION_STATUS_PROPERTY?.trim() || "status";
/** Match this select/status option name (case-insensitive); default `published` */
const PUBLISHED_LABEL =
  process.env.NOTION_PUBLISHED_LABEL?.trim().toLowerCase() || "published";

console.log("DATABASE_ID:", DATABASE_ID);
console.log("DATA_SOURCE_ID:", DATA_SOURCE_ID);

/** Notion page cover: external URL or hosted file URL (expires for file type). */
function pageCoverUrl(page) {
  const c = page?.cover;
  if (!c || typeof c !== "object") return null;
  if (c.type === "external" && c.external?.url) return c.external.url;
  if (c.type === "file" && c.file?.url) return c.file.url;
  return null;
}

function richTextToPlain(items) {
  if (!items?.length) return "";
  return items.map((i) => i.plain_text ?? "").join("").trim();
}

function formatFormula(f) {
  if (!f) return null;
  if (f.type === "string") return f.string ?? null;
  if (f.type === "number") return f.number ?? null;
  if (f.type === "boolean") return f.boolean ?? null;
  if (f.type === "date") return f.date ?? null;
  return null;
}

/**
 * One Notion page property → plain JSON-friendly value.
 */
function formatProperty(prop) {
  if (!prop || typeof prop !== "object" || !prop.type) return undefined;

  switch (prop.type) {
    case "title":
      return richTextToPlain(prop.title);
    case "rich_text":
      return richTextToPlain(prop.rich_text);
    case "number":
      return prop.number ?? null;
    case "checkbox":
      return Boolean(prop.checkbox);
    case "select":
      return prop.select?.name ?? null;
    case "multi_select":
      // Only option labels — no Notion ids, colors, etc.
      return (prop.multi_select ?? [])
        .map((o) => (typeof o?.name === "string" ? o.name.trim() : ""))
        .filter(Boolean);
    case "status":
      return prop.status?.name ?? null;
    case "date": {
      const d = prop.date;
      if (!d?.start) return null;
      // Single value: start date; range: "start → end" — no time_zone / null noise
      return d.end ? `${d.start} → ${d.end}` : d.start;
    }
    case "url":
      return prop.url ?? null;
    case "email":
      return prop.email ?? null;
    case "phone_number":
      return prop.phone_number ?? null;
    case "people": {
      const list = prop.people;
      if (!list) return [];
      const arr = Array.isArray(list) ? list : [list];
      return arr.map((p) => p?.name || p?.id || null).filter(Boolean);
    }
    case "files":
      return (prop.files ?? [])
        .map((f) => f?.file?.url || f?.external?.url || f?.name || null)
        .filter(Boolean);
    case "formula":
      return formatFormula(prop.formula);
    case "relation":
      return Array.isArray(prop.relation) ? [...prop.relation] : [];
    case "rollup":
      // Raw rollup objects are huge; omit from cleaned JSON (use formula or a dedicated sync if needed)
      return undefined;
    case "created_time":
      return prop.created_time ?? null;
    case "created_by":
      return prop.created_by?.name || prop.created_by?.id || null;
    case "last_edited_time":
      return prop.last_edited_time ?? null;
    case "last_edited_by":
      return prop.last_edited_by?.name || prop.last_edited_by?.id || null;
    case "unique_id": {
      const u = prop.unique_id;
      if (!u) return null;
      if (u.prefix != null && u.number != null)
        return `${u.prefix}-${u.number}`;
      return u.number ?? null;
    }
    default:
      return undefined;
  }
}

/**
 * Full page → one flat object: Notion columns at top level + id, url, cover_url
 * (id/url/cover_url last so they win if a column shares the same name).
 */
function cleanPage(page) {
  const out = {};
  for (const [key, raw] of Object.entries(page.properties ?? {})) {
    const v = formatProperty(raw);
    if (v !== undefined) out[key] = v;
  }
  out.id = page.id;
  out.url = page.url;
  out.cover_url = pageCoverUrl(page);
  return out;
}

function rawStatusName(page) {
  const prop = page.properties?.[STATUS_PROPERTY];
  if (!prop) return null;
  if (prop.type === "select") return prop.select?.name ?? null;
  if (prop.type === "status") return prop.status?.name ?? null;
  return null;
}

function isPublished(page) {
  const name = rawStatusName(page);
  if (!name) return false;
  return name.trim().toLowerCase() === PUBLISHED_LABEL;
}

function printJson(label, value) {
  console.log(`${label}\n${JSON.stringify(value, null, 2)}\n`);
}

async function main() {
  try {
    console.log("Fetching from Notion...\n");

    if (!DATABASE_ID) {
      throw new Error("NOTION_DB_ID is not set in .env");
    }

    let dataSourceId = DATA_SOURCE_ID;
    if (!dataSourceId) {
      const database = await notion.databases.retrieve({
        database_id: DATABASE_ID,
      });
      dataSourceId = database.data_sources?.[0]?.id;
      if (!dataSourceId) {
        throw new Error(
          "No data source on this database. Set NOTION_DATA_SOURCE_ID in .env."
        );
      }
    }

    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      result_type: "page",
    });

    const pages = response.results.filter(isFullPage);

    if (process.env.NOTION_DEBUG_RAW === "1") {
      printJson("=== DEBUG raw pages (full Notion properties) ===", {
        object: response.object,
        has_more: response.has_more,
        next_cursor: response.next_cursor,
        result_count: pages.length,
        pages: pages.map((p) => ({
          id: p.id,
          url: p.url,
          properties: p.properties,
        })),
      });
    }

    // Clean JSON: flat — DB columns + id, url, cover_url (no nested `properties`)
    const allCleaned = pages.map(cleanPage);
    printJson("=== all pages, cleaned (flat) ===", allCleaned);

    // Only published (status / Status column → select name `published`)
    const publishedCleaned = pages.filter(isPublished).map(cleanPage);
    printJson(
      `=== published only (${PUBLISHED_LABEL}, property "${STATUS_PROPERTY}") ===`,
      publishedCleaned
    );

    const skipped = pages.length - publishedCleaned.length;
    console.log(
      `Done: ${publishedCleaned.length} published, ${skipped} skipped (not ${PUBLISHED_LABEL}).`
    );
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

main();
