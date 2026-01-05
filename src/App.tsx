// src/App.tsx

import { useState } from "react";
import ConditionBuilderDemo from "./demo/ConditionBuilderDemo";
// import ButtonDemo from "./demo/ButtonDemo";
// import FormDemo from "./demo/FormDemo";

type DemoKey = "conditionBuilder"; // | "button" | "form"

export default function App() {
  const [demo, setDemo] = useState<DemoKey>("conditionBuilder");

  return (
    <div>
      <div style={{ padding: 16, borderBottom: "1px solid #e5e7eb" }}>
        <select value={demo} onChange={(e) => setDemo(e.target.value as DemoKey)}>
          <option value="conditionBuilder">Condition Builder</option>
          {/* <option value="button">Button</option> */}
          {/* <option value="form">Form</option> */}
        </select>
      </div>

      {demo === "conditionBuilder" ? <ConditionBuilderDemo /> : null}
      {/* {demo === "button" ? <ButtonDemo /> : null} */}
      {/* {demo === "form" ? <FormDemo /> : null} */}
    </div>
  );
}