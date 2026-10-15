import { describe, expect, it } from "vitest";
import { objectNavigatorTargetForTreeNode } from "../objectNavigatorTarget";
import type { TreeNode } from "@/types/database";

function node(type: TreeNode["type"], extras: Partial<TreeNode> = {}): TreeNode {
  return { id: type, label: type, type, connectionId: "conn", database: "app", ...extras };
}

describe("objectNavigatorTargetForTreeNode", () => {
  it("shows databases for a connection and all objects for a database", () => {
    expect(objectNavigatorTargetForTreeNode(node("connection"))).toMatchObject({ database: "", filter: "all" });
    expect(objectNavigatorTargetForTreeNode(node("database"))).toMatchObject({ database: "app", filter: "all" });
  });

  it("maps object groups to the corresponding list", () => {
    expect(objectNavigatorTargetForTreeNode(node("group-tables"))?.filter).toBe("tables");
    expect(objectNavigatorTargetForTreeNode(node("group-views"))?.filter).toBe("views");
    expect(objectNavigatorTargetForTreeNode(node("group-procedures"))?.filter).toBe("procedures");
  });

  it("locates a selected table and ignores unrelated tree controls", () => {
    expect(objectNavigatorTargetForTreeNode(node("table", { label: "orders" }))).toMatchObject({ filter: "tables", selectedObjectName: "orders" });
    expect(objectNavigatorTargetForTreeNode(node("load-more"))).toBeNull();
  });
});
