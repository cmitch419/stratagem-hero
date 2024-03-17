/* eslint-disable react/prop-types */
import { List } from "@mui/material";
import { StratagemLine } from "./Stratagem";

function StratagemList({ stratagems=[], }) {
    return (<List>
        {stratagems && stratagems.map((stratagem)=>{
            <StratagemLine stratagem={stratagem} />
        })}
    </List>);
}

export default StratagemList;