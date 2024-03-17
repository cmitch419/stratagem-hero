import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useEffect, useState } from "react";
import stratagemsData from '../data/stratagemsData.json';
import { StratagemIcon, StratagemInfo } from "../components/Stratagem";
import { getAllOfAttribute, getStratagemsByCategory } from "../functions/stratagem";

function Stratagems() {
    const [selectedStratagem, setSelectedStratagem] = useState(null);

    useEffect(() => {
        console.log(getAllOfAttribute(stratagemsData,"category").map(cat=>getStratagemsByCategory(stratagemsData,cat)));
        
    },[]);
  
    const drawer = (
        <List>
          {stratagemsData.map((stratagem, index) => (
            // <StratagemLine key={index} stratagem={stratagem} />
            <ListItem key={index} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                    <StratagemIcon {...stratagem} />
                </ListItemIcon>
                <ListItemText primary={stratagem.name} onClick={() => setSelectedStratagem(index)}/>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
    );
  
    return (
        <Box sx={{ display: 'flex', background: "rgba(0,0,0,0.5)" }}>
            <Box sx={{ width: '40%', overflowY: 'scroll' }}>
                    {drawer}
            </Box>
            <Box
                sx={{ flexGrow: 1, p: 3, width: '60%' }}
            >
                <StratagemInfo stratagem={stratagemsData[selectedStratagem]} />
            </Box>
        </Box>
    );
}

export default Stratagems;