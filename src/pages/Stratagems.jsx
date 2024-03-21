import { Box, Checkbox, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import defaultStratagemsData, { getAllCategories, stratagemsDataV3 as stratagemsById } from '../data/stratagemsData';

import { StratagemIcon } from "../components/StratagemIcon";
import StratagemInfo from "../components/StratagemInfo";
import { ArrowCombo } from "../components/Stratagem";

function Stratagems({stratagemsData, disabledStratagems, setDisabledStratagems}) {
  const stratagems = stratagemsData || defaultStratagemsData;

  const [selectedStratagem, setSelectedStratagem] = useState(null);
  const [categories,setCategories] = useState([]);
window.c = categories;
window.s = stratagems;
  const addToDisabledStratagems = (id) => {
    setDisabledStratagems((prevDisabledStratagems) => {
      const newDisabledStratagems = new Set(prevDisabledStratagems);
      newDisabledStratagems.add(id);
      return newDisabledStratagems;
    });
  };

  const removeFromDisabledStratagems = (id) => {
    setDisabledStratagems((prevDisabledStratagems) => {
      const newDisabledStratagems = new Set(prevDisabledStratagems);
      newDisabledStratagems.delete(id);
      return newDisabledStratagems;
    });
  };

  useEffect(() => {
    console.log('stratagems:',stratagemsData);
    if (stratagemsData) { setCategories(getAllCategories(stratagemsData)) }
  },[stratagemsData]);

  return (
    <Box sx={{ display: 'flex', background: "rgba(0,0,0,0.5)", height: '100%' }}>
      <Box sx={{ width: '40%', overflowY: 'scroll' }}>
        <List subheader={<li />}>
          {categories.map((category,i) => {
            return (<>
            <ListSubheader disableGutters key={i} sx={{
              display: 'flex',
              flex: 1,
              justifyContent: 'flex-start',
              p: '0.25rem'
            }}>
              <Typography color="primary" sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              }}>{category}</Typography>
            </ListSubheader>
            {stratagems.filter(stratagem=>(stratagem.category ?? 'Uncategorized')===category).map((stratagem, index) => {
              return (
              // <StratagemLine key={index} stratagem={stratagem} />
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={() => setSelectedStratagem(stratagem.id)}>
                  <ListItemIcon>
                    <StratagemIcon {...stratagem} />
                  </ListItemIcon>
                  <Stack>
                    <ListItemText
                      primary={stratagem.name}
                    />
                    <ArrowCombo {...stratagem} />
                  </Stack>
                </ListItemButton>
              </ListItem>
              )})}</>)})}
        </List>
      </Box>
      <Box
        sx={{  p: 0, width: '60%' }}
      > 
        <StratagemInfo stratagem={stratagemsById[selectedStratagem]} />
        { selectedStratagem !== null
        ? <Stack direction="row" alignItems="center">
          <Checkbox
            checked={!disabledStratagems.has(selectedStratagem)}
            onChange={({target: { checked }})=>{
              console.log(checked);
              if (!checked) {
                addToDisabledStratagems(selectedStratagem);
              } else {
                removeFromDisabledStratagems(selectedStratagem);
              }
            }}
          />
          <Typography>Enabled in Stratagem Hero</Typography>
        </Stack>
        : <></> }
      </Box>
    </Box>
  );
}

export default Stratagems;