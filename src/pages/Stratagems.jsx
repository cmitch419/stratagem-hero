import { Box, Checkbox, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import defaultStratagemsData, { getAllCategories, stratagemsDataV3 as stratagemsById } from '../data/stratagemsData';

import { StratagemIcon } from "../components/StratagemIcon";
import StratagemInfo from "../components/StratagemInfo";
import { ArrowCombo } from "../components/Stratagem";

function Stratagems({ stratagemsData, disabledStratagems, setDisabledStratagems }) {
  const stratagems = stratagemsData || defaultStratagemsData;
  const theme = useTheme();

  const [selectedStratagem, setSelectedStratagem] = useState(null);
  const [categories, setCategories] = useState([]);

  const isBigBoi = useMediaQuery(theme.breakpoints.up('md'));

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

  const addAllToDisabledStratagems = (category) => {
    stratagemsData
      .filter(({ category: cat = 'Uncategorized' }) => (!category || cat === category))
      .forEach(({ id }) => { addToDisabledStratagems(id) });
  };

  const removeAllFromDisabledStratagems = (category) => {
    if (category) {
      stratagemsData
        .filter(({ category: cat = 'Uncategorized' }) => (cat === category))
        .forEach(({ id }) => { removeFromDisabledStratagems(id) });
    } else {
      setDisabledStratagems(new Set());
    }
  };

  const noneAreChecked = (category) => {
    const result = stratagemsData
      .filter(({ category: cat = 'Uncategorized' }) => (cat === category))
      .every(({ id }) => disabledStratagems.has(id));

    console.debug(result);

    return result;
  }
  const allAreChecked = (category) =>
    stratagemsData
      .filter(({ category: cat = 'Uncategorized' }) => (cat === category))
      .every(({ id }) => !disabledStratagems.has(id));


  function EnabledCheckbox({ stratagemId }) {
    return (<Checkbox
      sx={{
        pr: 0
      }}
      checked={!disabledStratagems.has(stratagemId)}
      onChange={({ target: { checked } }) => {
        if (!checked) {
          addToDisabledStratagems(stratagemId);
        } else {
          removeFromDisabledStratagems(stratagemId);
        }
        setSelectedStratagem(stratagemId);
      }} />);
  }
  function CategoryEnabledCheckbox({ category = 'Uncategorized' }) {
    return (<Checkbox
      checked={allAreChecked(category)}
      indeterminate={!allAreChecked(category) && !noneAreChecked(category)}
      onChange={({ target: { checked } }) => {
        if (!checked) {
          addAllToDisabledStratagems(category);
        } else {
          removeAllFromDisabledStratagems(category);
        }
      }} />);
  }

  useEffect(() => {
    if (stratagemsData) { setCategories(getAllCategories(stratagemsData)) }
  }, [stratagemsData]);

  return (
    <Stack
      direction={isBigBoi ? 'row' : 'column'}
      sx={{
        flex: 1,
        width: 'auto',
        height: '100cqh',
      }}>
      <List subheader={<li />} sx={{
        width: isBigBoi ? '50%' : '100%',
        overflowY: 'scroll',
        overflowX: 'hidden',
        height: '100%',
        backdropFilter: 'blur(1rem)',
        pb: 0,
      }}>
        {categories.map((category, i) => {
          return (<div key={i}>
            <ListSubheader disableGutters sx={{
              justifyContent: 'flex-start',
            }}>
              <Stack direction="row" justifyContent="flex-start" alignItems="center" sx={{
                width: '100%'
              }}>
                <CategoryEnabledCheckbox category={category} />
                <Typography variant="h6" sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>{category}</Typography>
              </Stack>
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
            })}</div>)
        })}
      </List>
      {selectedStratagem &&
        <Stack
          sx={{
            width: 'auto',
            height: isBigBoi ? '100%' : 'auto',
          }}
        >
          <StratagemInfo stratagem={stratagemsById[selectedStratagem]} />
          {selectedStratagem !== null && isBigBoi
            ? <Stack direction="row" alignItems="center">
              <EnabledCheckbox stratagemId={selectedStratagem} />
              <Typography>Enabled in Stratagem Hero</Typography>
            </Stack>
            : null}
        </Stack>}
    </Stack>
  );
}

export default Stratagems;