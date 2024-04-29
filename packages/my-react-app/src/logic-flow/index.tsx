import "@logicflow/core/dist/style/index.css";
import "@logicflow/extension/lib/style/index.css";

import type { Definition, EdgeConfig, GraphConfigData, GraphModel, NodeConfig, NodeData, RegisterConfig } from '@logicflow/core'
import { useEffect, useRef, useState, memo, useMemo, useCallback } from 'react'
import { setupLogicFlow, type LogicFlow } from "./utils";
import RightDeaignPanel from './components/RightDeaignPanel'

const LogicFlowMain = () => {
  const containerRef = useRef<null | HTMLDivElement>(null);
  /** LogicFlow实例 */
  const lfInstance = useRef<null | LogicFlow>(null);
  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) {
      return;
    }
    // 初始化LogicFlow流程设计器
    const lf = setupLogicFlow(containerEl);

    lfInstance.current = lf;
    // @ts-expect-error test用
    window.lf = lf;
  }, [containerRef]);
  return (
    <div
      className="lf-container flex flex-row w-full"
      style={{ height: "100vh" }}
    >
      {/* 流程图设计区 */}
      <div
        id="container"
        className="flex-grow w-full h-full relative p-5"
        style={{ boxShadow: "inset rgb(197 197 197) 0px 0px 4px 0px" }}
        ref={containerRef}
      ></div>
      {/* 属性、设计面板 */}
      <div className="property-container w-80 flex-shrink-0">
        <RightDeaignPanel></RightDeaignPanel>
      </div>
    </div>
  );
}
export default LogicFlowMain