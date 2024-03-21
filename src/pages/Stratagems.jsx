import { Box, Checkbox, FormControlLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import defaultStratagemsData from '../data/stratagemsData.json';

import { getAllOfAttribute, getStratagemsByCategory } from "../functions/stratagem";
import { StratagemIcon } from "../components/StratagemIcon";
import StratagemInfo from "../components/StratagemInfo";
import { StratagemLine } from "../components/StratagemList";
import { ArrowCombo } from "../components/Stratagem";

function Stratagems({stratagemsData, disabledStratagems=[], setDisabledStratagems}) {
  const stratagems = stratagemsData || defaultStratagemsData;

  const [selectedStratagem, setSelectedStratagem] = useState(null);
  // const [disabledStratagems, setDisabledStratagems] = useState([]);

  useEffect(() => {
    console.log(getAllOfAttribute(stratagems, "category").map(cat => getStratagemsByCategory(stratagems, cat)));
  }, []);

  useEffect(() => {
    console.log(disabledStratagems);
  },[disabledStratagems]);

  return (
    <Box sx={{ display: 'flex', background: "rgba(0,0,0,0.5)", height: '100%' }}>
      <Box sx={{ width: '40%', overflowY: 'scroll' }}>
        <List>
          {stratagems.map((stratagem, index) => (
            // <StratagemLine key={index} stratagem={stratagem} />
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={() => setSelectedStratagem(index)}>
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
          ))}
        </List>
      </Box>
      <Box
        sx={{ p: 3, width: '60%' }}
      > 
        <StratagemInfo stratagem={stratagems[selectedStratagem]} />
        <Stack direction="row" alignItems="center">
          <Checkbox
            checked={disabledStratagems.indexOf(selectedStratagem) < 0}
            onChange={({target: { checked }})=>{
              console.log(checked);
              if (!checked) {
                setDisabledStratagems([...disabledStratagems,selectedStratagem]);
              } else {
                setDisabledStratagems(disabledStratagems.filter(v=>v!==selectedStratagem));
              }
            }}
          />
          <Typography>Enabled in Stratagem Hero</Typography>
        </Stack>
      </Box>
    </Box>
  );
}

export default Stratagems;