/** 
 * @file 流程设计右侧面板
 */
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useState } from "react";
import type { SyntheticEvent } from "react";
const RightDeaignPanel = () => {
  const [value, setValue] = useState(0)
  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Box>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="basic tabs example"
      >
        <Tab label={"Item One"} id="1" aria-labelledby="simple-tab-1"></Tab>
        <Tab label={"Item Two"} id="2" aria-labelledby="simple-tab-2"></Tab>
        <Tab label={"Item Three"} id="3" aria-labelledby="simple-tab-3"></Tab>
      </Tabs>
    </Box>
  );
}
export default RightDeaignPanel