import { sql } from "drizzle-orm";
import { boolean, jsonb, pgTableCreator, text, timestamp, varchar } from "drizzle-orm/pg-core";
export const createTable = pgTableCreator((name) => `Syntaxis_${name}`);

export const users = createTable("users", {
    id: varchar("id", { length: 255 })
        .notNull()
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    username: varchar("username", { length: 255 }).notNull().unique(),
    email: varchar("email", { length: 255 }).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", {
        mode: "date",
        withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
});

export const projects = createTable("projects", {
    id: varchar("id", { length: 255 })
        .notNull()
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    userId: varchar("user_id", { length: 255 })
        .notNull()
        .references(() => users.id),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", {
        mode: "date",
        withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
        mode: "date",
        withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
    description: text("description"),
    language: varchar("language", { length: 255 }).notNull(),
    isPublic: boolean("is_public").notNull().default(false),
    configuration: jsonb("configuration"),
    templateId: varchar("template_id", { length: 255 }).references(() => templates.id),
});

export const templates = createTable("templates", {
    id: varchar("id", { length: 255 })
        .notNull()
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    language: varchar("language", { length: 255 }).notNull(),
    s3TemplateKey: varchar("s3_template_key", { length: 255 }).notNull(),
    isOfficial: boolean("is_official").notNull().default(false),
    defaultConfig: jsonb("default_config"),
    createdAt: timestamp("created_at", {
        mode: "date",
        withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
});

export const workspace = createTable("workspace", {
    id: varchar("id", { length: 255 })
        .notNull()
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    projectId: varchar("project_id", { length: 255 })
        .notNull()
        .references(() => projects.id),
    userId: varchar("user_id", { length: 255 })
        .notNull()
        .references(() => users.id),
    createdAt: timestamp("created_at", {
        mode: "date",
        withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
    status: varchar("status", { length: 255 }).notNull().default("active"),
    environmentVars: jsonb("environment_vars"),
    containerId: varchar("container_id", { length: 255 }),
    ec2InstanceId: varchar("ec2_instance_id", { length: 255 }),
    resourcesLimits: jsonb("resources_limits"),
});

export const ec2Instances = createTable("ec2_instances", {
    id: varchar("id", { length: 255 })
        .notNull()
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    instanceId: varchar("instance_id", { length: 255 }).notNull(),
    status: varchar("status", { length: 255 }).notNull(),
    launchedAt: timestamp("launched_at", {
        mode: "date",
        withTimezone: true,
    }),
    ipAddress: varchar("ip_address", { length: 255 }),
    specs: jsonb("specs"),
    region: varchar("region", { length: 255 }).notNull(),
    lastHealthCheck: timestamp("last_health_check", {
        mode: "date",
        withTimezone: true,
    }),
    securityGroups: varchar("security_groups", { length: 255 }),
});
