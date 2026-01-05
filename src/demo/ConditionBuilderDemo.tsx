// src/demos/ConditionBuilderDemo.tsx

import { useState } from "react";
import {
  ConditionBuilder,
  type ConditionBuilderValue,
  type ConditionBuilderConfig,
} from "../components/patterns/ConditionBuilder";

export default function ConditionBuilderDemo() {
  const config: ConditionBuilderConfig = {
    objects: [
      { label: "Select object", value: "" },
      { label: "Employee", value: "employee" },
      { label: "Department", value: "department" },
      { label: "Status", value: "status" },
    ],
    operatorsByObject: {
      employee: [
        { label: "Select operator", value: "" },
        { label: "is", value: "is" },
        { label: "is not", value: "is_not" },
      ],
      department: [
        { label: "Select operator", value: "" },
        { label: "is", value: "is" },
        { label: "is not", value: "is_not" },
      ],
      status: [
        { label: "Select operator", value: "" },
        { label: "is", value: "is" },
        { label: "is not", value: "is_not" },
      ],
    },
    valuesByObject: {
      employee: [
        { label: "Select value", value: "" },
        { label: "Contractor", value: "contractor" },
        { label: "Full-time", value: "full_time" },
        { label: "Part-time", value: "part_time" },
      ],
      department: [
        { label: "Select value", value: "" },
        { label: "Engineering", value: "eng" },
        { label: "Design", value: "design" },
        { label: "HR", value: "hr" },
      ],
      status: [
        { label: "Select value", value: "" },
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
  };

  const [val, setVal] = useState<ConditionBuilderValue>({
    groups: [{ id: 1, rules: [{ id: 1, object: "", operator: "", value: "" }] }],
  });


  return (
    <div style={{ padding: 24, maxWidth: 980, display: "grid", gap: 14 }}>
      <ConditionBuilder config={config} value={val} onChange={setVal} />


    </div>
  );
}