// test-notion.js

import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  Client,
  isFullPage,
  isFullBlock,
  collectPaginatedAPI,
} from "@notionhq/client";
// import { kv } from "@vercel/kv"; // uncomment later when testing KV

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** Markdown files written next to this script */
const EXPORT_DIR = path.join(__dirname, "notion-export");

// 🔑 CONFIG
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = process.env.NOTION_DB_ID;
/** v5+ queries use data sources; optional override if you already have the ID */
const DATA_SOURCE_ID = process.env.NOTION_DB_ID;

console.log("DATABASE_ID:", DATABASE_ID);
console.log("DATA_SOURCE_ID:", DATA_SOURCE_ID);

function pageCoverUrl(page) {
  const c = page?.cover;
  if (!c || typeof c !== "object") return null;
  if (c.type === "external" && c.external?.url) return c.external.url;
  if (c.type === "file" && c.file?.url) return c.file.url;
  return null;
}

// 🧹 Clean Notion data
function cleanPage(page) {
  return {
    id: page.id,
    title: page.properties.Title?.title?.[0]?.text?.content || "",
    slug: page.properties.Slug?.rich_text?.[0]?.text?.content || "",
    created: page.created_time,
    lastEdited: page.last_edited_time,
    url: page.url,
    cover_url: pageCoverUrl(page),
  };
}

function safeFilename(slug, pageId) {
  const raw = (slug || "").trim() || pageId.replace(/-/g, "");
  const safe = raw.replace(/[^\w.-]+/g, "-").replace(/^-|-$/g, "") || "page";
  return `${safe.slice(0, 120)}.md`;
}

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
        line = url
          ? `${indent}[${cap || url}](${url})\n\n`
          : "";
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
      md += await blocksToMarkdown(
        notionClient,
        block.id,
        indent + listIndent
      );
    }
  }

  return md;
}

async function main() {
  try {
    console.log("Fetching from Notion...");

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

    await fs.mkdir(EXPORT_DIR, { recursive: true });

    const exported = [];

    for (const result of response.results) {
      if (!isFullPage(result)) continue;

      const meta = cleanPage(result);
      const mdBody = (await blocksToMarkdown(notion, result.id)).trim();
      const frontmatter =
        "---\n" +
        `title: ${JSON.stringify(meta.title)}\n` +
        `slug: ${JSON.stringify(meta.slug)}\n` +
        `url: ${JSON.stringify(meta.url)}\n` +
        `cover_url: ${JSON.stringify(meta.cover_url)}\n` +
        `created: ${meta.created}\n` +
        `lastEdited: ${meta.lastEdited}\n` +
        "---\n\n";
      const fullMd = frontmatter + (mdBody ? `${mdBody}\n` : "_No page body._\n");

      const outPath = path.join(EXPORT_DIR, safeFilename(meta.slug, result.id));
      await fs.writeFile(outPath, fullMd, "utf8");

      const entry = {
        ...meta,
        markdownPath: outPath,
        markdown: fullMd,
      };
      exported.push(entry);

      console.log("--------------------------------");
      console.log("url:", meta.url);
      console.log("cover_url:", meta.cover_url);
      console.log("exported:", outPath);
      console.log("preview:\n", fullMd.slice(0, 500) + (fullMd.length > 500 ? "…" : ""));
      console.log("--------------------------------");
    }

    console.log("\n✅ Exported pages:", exported.length);
    console.log("✅ Cleaned + markdown (in-memory array `exported` last run):");
    console.log(
      exported.map((e) => ({
        title: e.title,
        slug: e.slug,
        url: e.url,
        cover_url: e.cover_url,
        markdownPath: e.markdownPath,
      }))
    );

    // =========================
    // 🔥 KV TEST (OPTIONAL)
    // =========================
    /*
    console.log("\nTesting KV storage...");

    await kv.set("test-posts", cleaned);

    const stored = await kv.get("test-posts");

    console.log("\n📦 Data from KV:\n");
    console.log(stored);
    */
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

main();
