/**
 * FreeLawGen Schema
 *
 * Legal-case tables for the AI attorney platform. FreeLawGen has its OWN
 * PostgreSQL database (product = database isolation, decided 2026-09-10) —
 * it is NOT shared with AStartupWorld / Supabase.
 *
 * DB connection: .env.local → DATABASE_URL → server/db.ts
 * Migrations:   npx drizzle-kit generate → npx drizzle-kit push
 */

import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
  index,
} from "drizzle-orm/pg-core";

// ── FreeLawGen tables ───────────────────────────────────────────────

/**
 * Legal cases. Each case ties together a plaintiff, defendant,
 * court, and the documents generated for it.
 */
export const cases = pgTable(
  "cases",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    plaintiff: text("plaintiff").notNull(),
    defendant: text("defendant").notNull(),
    court: text("court"),
    caseNumber: text("case_number"),
    jurisdiction: text("jurisdiction"),
    causeOfAction: text("cause_of_action"),
    status: text("status").default("active"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("cases_plaintiff_idx").on(table.plaintiff),
    index("cases_status_idx").on(table.status),
  ]
);

export const casesRelations = relations(cases, ({ many }) => ({
  documents: many(documents),
}));

/**
 * Legal documents — pleadings, motions, briefs, orders, etc.
 * Content is stored as Markdown; DOCX/PDF are generated on export.
 */
export const documents = pgTable(
  "documents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    caseId: uuid("case_id").references(() => cases.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    documentType: text("document_type"), // complaint, answer, motion, brief, appeal, order, other
    content: text("content"), // Markdown source
    status: text("status").default("draft"), // draft, review, final, filed
    version: integer("version").default(1).notNull(),
    wordCount: integer("word_count"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("documents_case_idx").on(table.caseId),
    index("documents_type_idx").on(table.documentType),
    index("documents_status_idx").on(table.status),
  ]
);

export const documentsRelations = relations(documents, ({ one }) => ({
  case: one(cases, {
    fields: [documents.caseId],
    references: [cases.id],
  }),
}));

/**
 * Legal research items — cases, statutes, regulations, secondary sources.
 * Links to a case for context.
 */
export const researchItems = pgTable(
  "research_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    caseId: uuid("case_id").references(() => cases.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    sourceType: text("source_type").notNull(), // case, statute, regulation, secondary, other
    source: text("source"), // citation
    url: text("url"),
    summary: text("summary"),
    content: text("content"), // full text or key excerpts
    relevance: integer("relevance").default(0), // 0-100
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("research_case_idx").on(table.caseId),
    index("research_source_idx").on(table.sourceType),
  ]
);

/**
 * Document templates — pre-built structures for common filings.
 * Content is Markdown with {{variable}} placeholders.
 */
export const templates = pgTable(
  "templates",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    documentType: text("document_type").notNull(),
    jurisdiction: text("jurisdiction"), // federal, state, specific court
    content: text("content").notNull(), // Markdown template
    variables: text("variables"), // JSON array of variable names
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("templates_type_idx").on(table.documentType),
  ]
);

/**
 * AI generations — tracks prompts and responses from the AI attorney.
 */
export const aiGenerations = pgTable(
  "ai_generations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    caseId: uuid("case_id").references(() => cases.id, { onDelete: "set null" }),
    documentId: uuid("document_id").references(() => documents.id, { onDelete: "set null" }),
    prompt: text("prompt").notNull(),
    response: text("response").notNull(),
    model: text("model"),
    tokensUsed: integer("tokens_used"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("ai_gen_case_idx").on(table.caseId),
    index("ai_gen_doc_idx").on(table.documentId),
  ]
);
