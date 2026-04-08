/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { ApiKeySelection } from "@/components/ApiKeySelection";
import { LogoGenerator } from "@/components/LogoGenerator";

export default function App() {
  const [isKeySelected, setIsKeySelected] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 font-sans selection:bg-neutral-900 selection:text-white">
      {!isKeySelected ? (
        <ApiKeySelection onKeySelected={() => setIsKeySelected(true)} />
      ) : (
        <LogoGenerator />
      )}
    </div>
  );
}
