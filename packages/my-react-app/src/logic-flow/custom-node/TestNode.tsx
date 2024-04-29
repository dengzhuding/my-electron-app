import { RegisterConfig } from "@logicflow/core";
import { RectResize } from "@logicflow/extension";

/** 自定义节点数据 */
class TestNodeTypeModel extends RectResize.model {
  setAttributes() {
    super.setAttributes();
    this.radius = 20;
  }
}
/** 自定义节点视图 */
class TestNodeTypeView extends RectResize.view {}

export const testNodeType: RegisterConfig = {
  type: "test-node-type",
  view: TestNodeTypeView,
  model: TestNodeTypeModel,
};