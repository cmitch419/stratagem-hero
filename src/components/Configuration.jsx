import { Box, IconButton, List, ListItem, Stack, TextField, Typography } from '@mui/material';
import useGameConfig from '../hooks/useGameConfig';
import { Restore } from '@mui/icons-material';

const Configuration = ({ title = 'Configuration' }) => {
    const { gameConfig, handleConfigChange, restoreDefaultConfig } = useGameConfig();

    return (<>
            <Stack direction="row">
                <Typography variant="h3">{title}</Typography>
                <IconButton title="Restore defaults" onClick={restoreDefaultConfig}>
                    <Restore />
                </IconButton>
            </Stack>
            <List sx={{ overflowY: 'scroll' }}>
                {Object.entries(gameConfig).map(([key, value]) => {
                    return (
                    <ListItem key={key}>
                        <Typography variant="h6">{camelToSentenceCase(key)}: </Typography>
                        <TextField
                            type="text"
                            value={value}
                            onChange={e => handleConfigChange(key, e.target.value)}
                        />
                    </ListItem>
                )})}
            </List>
        </>
    );
};

function camelToSentenceCase(camelCaseString) {
    // Split the camelCase string into words.
    const words = camelCaseString.split(/(?=[A-Z])/);

    // Convert the first letter of each word to uppercase.
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substring(1);
    }

    // Join the words back together with a space in between.
    return words.join(' ');
}
export default Configuration;
