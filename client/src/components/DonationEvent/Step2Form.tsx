import { useState, useEffect, ChangeEvent } from "react";
import { Typography, Grid, Box, Stack, TextField, InputAdornment } from '@mui/material';

type Step2FormProps = {
    validate: boolean
    data: (key: string, value: any) => void
}

export default function Step2Form(props: Step2FormProps) {

    const itemFields = [ 'Minimum Quantity', 'Target Quantity', 'Points Per ' ];
    const itemKeys = [ 'minQty', 'targetQty', 'pointsPerUnit' ];

    const allItems = [ 
        { item: "Broccoli", unit: "Kilogram" }, 
        { item: "Lettuce", unit: "Kilogram" }, 
        { item: "Chocolate Milk", unit: "Litre" }, 
        { item: "Apple Juice", unit: "Litre" }
    ];

    const [items, setItems] = useState(allItems);
    const [itemsInfo, setItemsInfo] = useState<{ [key: string]: number }[]>([{}]);

    const handleTextChange = (itemKey: string, index: number) => (event: ChangeEvent<HTMLInputElement>) => {
        setItemsInfo((prevData) => {
            const updatedItemsInfo = [...prevData];
            updatedItemsInfo[index] = {
                ...updatedItemsInfo[index],
                [itemKey]: parseFloat(event.target.value),
            };
            return updatedItemsInfo;
        });
    }

    console.log(itemsInfo);

    useEffect(() => {
        props.data("donationEventItems", itemsInfo);
    }, [itemsInfo]);
   
    return (
        <>
        <Typography variant="h5" gutterBottom sx={{ letterSpacing: "0.18rem", marginBottom: "1.5rem" }}>Fill up the information for each donation item</Typography>
        <Grid container justifyContent="space-between" sx={{ p: 2 }}>
            { items.map(function(item, i) {
                    return <Grid item xs={12} md={12} lg={6} sx={{ marginBottom: "1rem", }} key={i}>
                        <Box
                            component="form"
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            sx={{ width: 400, m: "auto",
                            '& > :not(style)': { m: "1rem", p: "1rem" }, boxShadow: 5, borderRadius: 2, 
                            }}
                            noValidate
                            autoComplete="off">
                            <Stack spacing={5}>
                                <Typography variant="h5" gutterBottom sx={{ letterSpacing: "0.18rem", marginBottom: "1.5rem" }}>Item {i+1}: {items[i].item}</Typography>
                                { itemFields.map(function(field, j) {
                                    return <TextField key={j} label={ (j !== 2) ? itemFields[j] : itemFields[j] + items[i].unit } 
                                        type="number" 
                                        InputProps={{ endAdornment: <InputAdornment position="end">{ (j !== 2) && items[i].unit }</InputAdornment> }}
                                        InputLabelProps={{ shrink: true }}
                                        sx={{ width: 300 }}
                                        value={itemsInfo[i] && itemsInfo[i][itemKeys[j]] ? itemsInfo[i][itemKeys[j]] : ''}
                                        onChange={handleTextChange(itemKeys[j], i)} /> }) }
                            </Stack>
                        </Box> 
                </Grid>  }) }
            </Grid>
        </>
    );
};