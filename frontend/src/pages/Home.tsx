import React, { useState } from "react";
import { Typography } from '@mui/material';
import { TextField } from '@mui/material';

const Home: React.FC = () => {
    return (
        <>
            <Typography variant="h4" gutterBottom>
                What would you like to post?
            </Typography>
            <TextField minRows={10} />
        </>
    );
}

export default Home;