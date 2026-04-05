/**
 * notion.js — Notion data layer
 *
 * Run standalone:  node notion.js          (reads NOTION_API_KEY + NOTION_DB_ID from .env)
 * Import:          import { fetchPosts } from "./notion.js"
 *
 * fetchPosts() takes all credentials and options as explicit parameters —
 * no env reads when imported. The caller (sync-firebase.js) owns all config.
 *
 * Fully dynamic: works for any Notion DB. Column names, types, and values are
 * never hardcoded — everything flows through formatProperty generically.
 *
 * Filter: if the DB has a "show" checkbox column, only pages where show = true
 * are included. No "show" column → all pages are included.
 */

import { fileURLToPath } from "node:url";
import {
  Client,
  isFullPage,
  isFullBlock,
  collectPaginatedAPI,
} from "@notionhq/client";

// ---------- property helpers (pure, no external deps) ----------

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

/** One Notion property → plain, JSON-safe value. Returns undefined to omit. */
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
      return (prop.multi_select ?? [])
        .map((o) => (typeof o?.name === "string" ? o.name.trim() : ""))
        .filter(Boolean);
    case "status":
      return prop.status?.name ?? null;
    case "date": {
      const d = prop.date;
      if (!d?.start) return null;
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
      if (u.prefix != null && u.number != null) return `${u.prefix}-${u.number}`;
      return u.number ?? null;
    }
    default:
      return undefined;
  }
}

/**
 * Full page → one flat object: every DB column at top level,
 * plus id, url, cover_url (appended last so they win on name collision).
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

// ---------- show filter ----------

/**
 * Returns true when the page should be included in the sync.
 * - No matching column → include everything.
 * - Column is a checkbox → include only when checked.
 * - Column exists but is not a checkbox → include (permissive fallback).
 */
function shouldSync(page, showProperty) {
  const prop = page.properties?.[showProperty];
  if (!prop) return true;
  if (prop.type !== "checkbox") return true;
  return prop.checkbox === true;
}

// ---------- doc-ID resolution ----------

/**
 * Determines the Firestore document ID for a page (priority order):
 * 1. docIdProperty option → use that column's formatted value.
 * 2. First unique_id-typed column in the raw page.
 * 3. Fallback: Notion page id.
 */
function resolveDocId(page, cleanedDoc, docIdProperty) {
  if (docIdProperty && cleanedDoc[docIdProperty] != null) {
    return String(cleanedDoc[docIdProperty]);
  }
  for (const raw of Object.values(page.properties ?? {})) {
    if (raw?.type === "unique_id") {
      const u = raw.unique_id;
      if (!u) continue;
      const val =
        u.prefix != null && u.number != null
          ? `${u.prefix}-${u.number}`
          : String(u.number ?? "");
      if (val) return val;
    }
  }
  return page.id;
}

// ---------- markdown blocks ----------

function richTextToMarkdown(richText) {
  if (!richText?.length) return "";
  return richText
    .map((rt) => {
      const plain = rt.plain_text ?? "";
      if (rt.type !== "text") return plain;
      const { bold, italic, strikethrough, code } = rt.annotations;
      const href = rt.text?.link?.url;
      let out = plain;
      if (code) out = `\`${out}\``;
      if (bold) out = `**${out}**`;
      if (italic) out = `*${out}*`;
      if (strikethrough) out = `~~${out}~~`;
      if (href) out = `[${out}](${href})`;
      return out;
    })
    .join("");
}

async function blocksToMarkdown(notionClient, parentBlockId, indent = "") {
  const blocks = await collectPaginatedAPI(notionClient.blocks.children.list, {
    block_id: parentBlockId,
  });

  let md = "";
  let numberedIndex = 0;
  let lastWasNumbered = false;

  for (const block of blocks) {
    if (!isFullBlock(block)) continue;

    const type = block.type;
    if (type === "numbered_list_item") {
      if (!lastWasNumbered) numberedIndex = 0;
      numberedIndex += 1;
      lastWasNumbered = true;
    } else {
      lastWasNumbered = false;
    }

    const payload = block[type];
    const rich = payload?.rich_text ?? [];
    const text = richTextToMarkdown(rich);
    let line = "";

    switch (type) {
      case "paragraph":
        line = text ? `${indent}${text}\n\n` : "\n";
        break;
      case "heading_1":
        line = `${indent}# ${text}\n\n`;
        break;
      case "heading_2":
        line = `${indent}## ${text}\n\n`;
        break;
      case "heading_3":
        line = `${indent}### ${text}\n\n`;
        break;
      case "bulleted_list_item":
        line = `${indent}- ${text}\n`;
        break;
      case "numbered_list_item":
        line = `${indent}${numberedIndex}. ${text}\n`;
        break;
      case "to_do":
        line = `${indent}- [${payload.checked ? "x" : " "}] ${text}\n`;
        break;
      case "quote":
        line = text
          ? `${indent}> ${text.replace(/\n/g, `\n${indent}> `)}\n\n`
          : "\n";
        break;
      case "code": {
        const codeText =
          payload.rich_text?.map((x) => x.plain_text).join("") ?? "";
        const lang = payload.language || "";
        line = `${indent}\`\`\`${lang}\n${codeText}\n\`\`\`\n\n`;
        break;
      }
      case "divider":
        line = `${indent}---\n\n`;
        break;
      case "callout":
        line = `${indent}> ${richTextToMarkdown(payload.rich_text)}\n\n`;
        break;
      case "image": {
        const url = payload.file?.url || payload.external?.url;
        const caption = richTextToMarkdown(payload.caption);
        line = url
          ? `${indent}![${caption}](${url})\n\n`
          : caption
            ? `${indent}${caption}\n\n`
            : "";
        break;
      }
      case "bookmark": {
        const url = payload.url;
        const cap = richTextToMarkdown(payload.caption);
        line = url ? `${indent}[${cap || url}](${url})\n\n` : "";
        break;
      }
      default:
        line = text ? `${indent}${text}\n\n` : "";
    }

    md += line;

    const listIndent =
      type === "bulleted_list_item" ||
      type === "numbered_list_item" ||
      type === "to_do"
        ? "  "
        : "";
    if (block.has_children) {
      md += await blocksToMarkdown(notionClient, block.id, indent + listIndent);
    }
  }

  return md;
}

// ---------- public API ----------

/**
 * Fetch all pages that pass the show filter, clean them, and add markdown body.
 *
 * @param {object} options
 * @param {string}  options.apiKey        - Notion integration token
 * @param {string}  options.dbId          - Notion database / data-source ID
 * @param {string}  [options.showProperty="show"]  - Checkbox column name for filter
 * @param {string}  [options.docIdProperty=null]   - Column to use as Firestore doc ID
 *
 * @returns {Promise<Array>} Flat doc objects, each with a `_docId` field for routing.
 */
export async function fetchPosts({
  apiKey,
  dbId,
  showProperty = "show",
  docIdProperty = null,
} = {}) {
  if (!apiKey) throw new Error("fetchPosts: apiKey is required");
  if (!dbId) throw new Error("fetchPosts: dbId is required");

  const notion = new Client({ auth: apiKey });

  const response = await notion.dataSources.query({
    data_source_id: dbId,
    result_type: "page",
  });

  const pages = response.results.filter(isFullPage);
  const posts = [];
  let skipped = 0;

  for (const page of pages) {
    if (!shouldSync(page, showProperty)) {
      skipped++;
      continue;
    }

    const doc = cleanPage(page);
    doc.content = (await blocksToMarkdown(notion, page.id)).trim();
    doc._docId = resolveDocId(page, doc, docIdProperty);
    posts.push(doc);
  }

  console.log(
    `Notion: ${posts.length} included, ${skipped} skipped (${showProperty} = false).`
  );

  return posts;
}

// ---------- standalone (reads .env only when run directly) ----------

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  const { default: dotenv } = await import("dotenv");
  dotenv.config();

  const posts = await fetchPosts({
    apiKey: process.env.NOTION_API_KEY,
    dbId: process.env.NOTION_DB_ID,
    showProperty: process.env.NOTION_SHOW_PROPERTY,
    docIdProperty: process.env.NOTION_DOC_ID_PROPERTY,
  });

  console.log("\n" + JSON.stringify(posts, null, 2));
  console.log(`\nTotal: ${posts.length} post(s)`);
}
