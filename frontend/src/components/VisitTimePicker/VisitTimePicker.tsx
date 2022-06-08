import React from "react";
import {Box, Button, Divider, Grid, Typography} from "@mui/material";
import {DailyVisits} from "../../types";
import moment from "moment";



interface VisitTimePickerProps {
    dayAndVisits: DailyVisits;
    selectedVisit?: number | null;
    selectVisit: (visitId: number) => void;
}

const VisitTimePicker: React.FC<VisitTimePickerProps> = ({dayAndVisits, selectedVisit, selectVisit}) => (
    <Grid container height="100%">
        <Grid item sm={12}>
            <Grid container justifyContent="center">
                {dayAndVisits.date.format("DD.MM.YY")}
            </Grid>
            <Grid container justifyContent="center">
                <Typography variant="caption">
                    {dayAndVisits.date.format("dddd")}
                </Typography>
            </Grid>
        </Grid>

        <Divider flexItem style={{marginRight: "-1px"}}/>

        <Grid item sm={12}>
            <Grid container justifyContent="center" justifyItems="center" height="100%">
                {dayAndVisits.visits?.length ? (
                    dayAndVisits.visits
                        .sort((a, b) => a.date.isBefore(b.date) ? -1 : 1)
                        .filter(({date}) => date.isAfter(moment()))
                        .map(({id, date}) => (
                            <Grid key={id} >
                                <Button
                                    disableElevation
                                    disabled={moment().isAfter(date)}
                                    variant={selectedVisit === id ? "contained" : "text"}
                                    onClick={() => selectVisit(id)}
                                    color={selectedVisit === id ? "primary" : "secondary"}
                                >
                                    {date.format("HH:mm")}
                                </Button>
                            </Grid>
                        ))
                    ) : (
                        <Typography textAlign="center">
                            Brak <br/> wolnych <br/> terminów
                        </Typography>
                    )}
            </Grid>
        </Grid>
    </Grid>
)



export default VisitTimePicker;
