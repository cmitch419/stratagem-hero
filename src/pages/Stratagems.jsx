import { Box, Checkbox, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import defaultStratagemsData, { getAllCategories, stratagemsDataV3 as stratagemsById } from '../data/stratagemsData';

import { StratagemIcon } from "../components/StratagemIcon";
import StratagemInfo from "../components/StratagemInfo";
import { ArrowCombo } from "../components/Stratagem";
import Configuration from "../components/Configuration";

function Stratagems({ stratagemsData, disabledStratagems, setDisabledStratagems }) {
  const stratagems = stratagemsData || defaultStratagemsData;

  const [selectedStratagem, setSelectedStratagem] = useState(null);
  const [categories, setCategories] = useState([]);

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

  function EnabledCheckbox({ stratagemId }) {
    return (<Checkbox
      checked={!disabledStratagems.has(stratagemId)}
      onChange={({ target: { checked } }) => {
        if (!checked) {
          addToDisabledStratagems(stratagemId);
        } else {
          removeFromDisabledStratagems(stratagemId);
        }
        setSelectedStratagem(stratagemId);
      }}
    />);
  }

  useEffect(() => {
    if (stratagemsData) { setCategories(getAllCategories(stratagemsData)) }
  }, [stratagemsData]);

  return (
    <Box sx={{
      display: 'flex',
      background: 'rgba(0,0,0,0.5)',
      height: '100%',
    }}>
      <Box sx={{
        width: '35%',
        overflowY: 'scroll',
        backdropFilter: 'blur(1rem)'
      }}>
        <List subheader={<li />}>
          {categories.map((category, i) => {
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
              {stratagems.filter(stratagem => (stratagem.category ?? 'Uncategorized') === category).map((stratagem, index) => {
                return (
                  <Stack key={index} direction="row">
                    <ListItem disablePadding>
                      <EnabledCheckbox stratagemId={stratagem.id} />
                      <ListItemButton onClick={() => setSelectedStratagem(stratagem.id)}>
                        <ListItemIcon>
                          <StratagemIcon {...stratagem} />
                        </ListItemIcon>
                        <Stack>
                          <ListItemText
                            primary={stratagem.name}
                          />
                          <ArrowCombo {...stratagem} valid />
                        </Stack>
                      </ListItemButton>
                    </ListItem>
                  </Stack>
                )
              })}</>)
          })}
        </List>
      </Box>
      <Stack sx={{
        p: 1,
        flex: 1,
      }}>
        <Box
          sx={{ p: 1, width: '60%' }}
        >
          <StratagemInfo stratagem={stratagemsById[selectedStratagem]} />
          {selectedStratagem !== null
            ? <Stack direction="row" alignItems="center">
              <EnabledCheckbox stratagemId={selectedStratagem} />
              <Typography>Enabled in Stratagem Hero</Typography>
            </Stack>
            : <></>}
        </Box>
        <Box sx={{ overflowY: 'scroll' }}>
          <Configuration />
        </Box>
      </Stack>
    </Box>
  );
}

export default Stratagems;