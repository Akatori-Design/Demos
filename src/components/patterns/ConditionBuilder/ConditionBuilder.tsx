// src/components/patterns/ConditionBuilder/ConditionBuilder.tsx

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { Button } from "../../ui/Button";
import { Select, type SelectOption } from "../../ui/Select";
import { AnimatePresence, motion } from "framer-motion";

export type Rule = {
  id: number;
  object: string;
  operator: string;
  value: string;
};

export type Group = {
  id: number;
  rules: Rule[];
};

export type ConditionBuilderValue = {
  groups: Group[];
};

export type ConditionBuilderConfig = {
  objects: SelectOption[];
  operatorsByObject: Record<string, SelectOption[]>;
  valuesByObject: Record<string, SelectOption[]>;
};

export type ConditionBuilderProps = {
  config: ConditionBuilderConfig;
  value?: ConditionBuilderValue;
  onChange?: (next: ConditionBuilderValue) => void;
};

const containerStyle: CSSProperties = {
  display: "grid",
  gap: 14,
};

const groupStyle: CSSProperties = {
  background: "#f3f4f6",
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 14,
  display: "grid",
  gap: 12,
};

const groupHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
};

const groupTitleStyle: CSSProperties = {
  fontWeight: 800,
  fontSize: 14,
  color: "#111827",
};

const ruleCardStyle: CSSProperties = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 12,
};

const ruleRowStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1.2fr 1fr 1.2fr auto",
  gap: 10,
  alignItems: "start", // keeps all selects top-aligned
};

const joinerLabelStyle: CSSProperties = {
  fontWeight: 800,
  fontSize: 12,
  color: "#6b7280",
  paddingLeft: 6,
};

const orLabelStyle: CSSProperties = {
  fontWeight: 900,
  fontSize: 14,
  color: "#6b7280",
  paddingLeft: 4,
};

const fadeSlide = {
  // Height collapse makes parent containers resize smoothly on remove.
  // Use a tween (not a spring) to avoid the tiny “settling” nudge at the end.
  initial: { opacity: 0, y: -6, height: 0 },
  animate: {
    opacity: 1,
    y: 0,
    height: "auto",
    transition: { type: "tween", duration: 0.22 },
  },
  exit: {
    opacity: 0,
    y: -6,
    height: 0,
    transition: { type: "tween", duration: 0.22 },
  },
} as const;

const layoutTween = {
  layout: { type: "tween", duration: 0.22 },
} as const;

function nextId(items: { id: number }[]) {
  return Math.max(0, ...items.map((x) => x.id)) + 1;
}

export function ConditionBuilder({ config, value, onChange }: ConditionBuilderProps) {
  // Uncontrolled fallback (works even if parent doesn’t pass value/onChange)
  const [internal, setInternal] = useState<ConditionBuilderValue>({
    groups: [{ id: 1, rules: [{ id: 1, object: "", operator: "", value: "" }] }],
  });

  const model = value ?? internal;

  function update(next: ConditionBuilderValue) {
    onChange?.(next);
    if (!value) setInternal(next);
  }

  function updateRule(groupId: number, ruleId: number, patch: Partial<Rule>) {
    update({
      groups: model.groups.map((g) =>
        g.id !== groupId
          ? g
          : {
              ...g,
              rules: g.rules.map((r) => (r.id === ruleId ? { ...r, ...patch } : r)),
            }
      ),
    });
  }

  function addRule(groupId: number) {
    update({
      groups: model.groups.map((g) => {
        if (g.id !== groupId) return g;
        const id = nextId(g.rules);
        return { ...g, rules: [...g.rules, { id, object: "", operator: "", value: "" }] };
      }),
    });
  }

  function removeRule(groupId: number, ruleId: number) {
    update({
      groups: model.groups.map((g) => {
        if (g.id !== groupId) return g;
        const nextRules = g.rules.filter((r) => r.id !== ruleId);
        return {
          ...g,
          rules: nextRules.length ? nextRules : [{ id: 1, object: "", operator: "", value: "" }],
        };
      }),
    });
  }

  function addGroup() {
    const gid = nextId(model.groups);
    update({
      groups: [...model.groups, { id: gid, rules: [{ id: 1, object: "", operator: "", value: "" }] }],
    });
  }

  function removeGroup(groupId: number) {
    const nextGroups = model.groups.filter((g) => g.id !== groupId);
    update({
      groups: nextGroups.length
        ? nextGroups
        : [{ id: 1, rules: [{ id: 1, object: "", operator: "", value: "" }] }],
    });
  }

  const preview = useMemo(() => {
    // (A AND B) OR (C AND D)
    const groups = model.groups.map((g) => {
      const rules = g.rules.map((r) => `${r.object || "…"} ${r.operator || "…"} ${r.value || "…"}`);
      return `(${rules.join(" AND ")})`;
    });
    return groups.length ? groups.join(" OR ") : "No groups yet.";
  }, [model]);

  return (
    <motion.div layout transition={layoutTween} style={containerStyle}>
      <AnimatePresence initial={false}>
        {model.groups.map((group, groupIndex) => (
          <motion.div
            key={group.id}
            layout
            transition={layoutTween}
            {...fadeSlide}
            style={{ display: "grid", gap: 10, overflow: "hidden" }}
          >
          {groupIndex > 0 ? <div style={orLabelStyle}>OR</div> : null}

          <div style={groupStyle}>
            <div style={groupHeaderStyle}>
              <div style={groupTitleStyle}>Group {groupIndex + 1}</div>

              <Button
                variant="ghost"
                onClick={() => removeGroup(group.id)}
                disabled={model.groups.length === 1}
                title="Remove group"
              >
                ✕
              </Button>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              <AnimatePresence initial={false}>
                {group.rules.map((rule, ruleIndex) => {
                  const operatorOptions =
                    config.operatorsByObject[rule.object] ?? [{ label: "Select operator", value: "" }];

                  const valueOptions =
                    config.valuesByObject[rule.object] ?? [{ label: "Select value", value: "" }];

                  return (
                    <motion.div
                      key={rule.id}
                      layout
                      transition={layoutTween}
                      {...fadeSlide}
                      style={{ display: "grid", gap: 8, overflow: "hidden" }}
                    >
                      {ruleIndex > 0 ? <div style={joinerLabelStyle}>AND</div> : null}

                      <div style={ruleCardStyle}>
                        <div style={ruleRowStyle}>
                          <Select
                            label={ruleIndex === 0 ? "Object" : undefined}
                            value={rule.object}
                            options={config.objects}
                            onChange={(value) =>
                              updateRule(group.id, rule.id, {
                                object: value,
                                operator: "",
                                value: "",
                              })
                            }
                          />

                          <Select
                            label={ruleIndex === 0 ? "Operator" : undefined}
                            value={rule.operator}
                            options={operatorOptions}
                            disabled={!rule.object}
                            onChange={(value) => updateRule(group.id, rule.id, { operator: value })}
                          />

                          <Select
                            label={ruleIndex === 0 ? "Value" : undefined}
                            value={rule.value}
                            options={valueOptions}
                            disabled={!rule.object || !rule.operator}
                            onChange={(value) => updateRule(group.id, rule.id, { value: value })}
                          />

                          <div style={{ display: "flex", alignItems: "flex-start" }}>
                            <Button
                              variant="ghost"
                              onClick={() => removeRule(group.id, rule.id)}
                              disabled={group.rules.length === 1}
                              title="Remove rule"
                            >
                              ✕
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <Button variant="secondary" onClick={() => addRule(group.id)}>
                Add Rule
              </Button>
            </div>
          </div>
        </motion.div>
        ))}
      </AnimatePresence>

      <motion.div
        layout
        transition={layoutTween}
        style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}
      >
        <Button variant="secondary" onClick={addGroup}>
          Add Group
        </Button>

        <div style={{ fontSize: 12, opacity: 0.75 }}>
          Preview: <span style={{ fontWeight: 800 }}>{preview}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ConditionBuilder;