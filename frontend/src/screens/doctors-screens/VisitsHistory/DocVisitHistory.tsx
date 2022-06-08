import React, {useEffect, useState} from "react";
import VisitHistoryCard from "./VisitHistoryCard";
import {Typography} from "@mui/material";
import {Grid} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers";
import {visitsApi} from "../../../api/visits.api";
import {Visit} from "../../../types";
import moment, {Moment} from "moment";
import TextField from "@mui/material/TextField";


const DocVisitsHistory: React.FC = () => {

    const [date, setDate] = useState<Date>(moment().toDate());
    const [visits, setVisits] = useState<Visit[]>([])
    const [wrongDate, setWrongDate] = useState<boolean>(false);

    const refreshList = () => {
        const today = new Date();
        if (date && today < date) {
            setWrongDate(true)
        } else {
            setWrongDate(false);
            visitsApi
                .getVisitsDoctor(moment(date))
                .then(res => setVisits(res));
        }
    }

    useEffect(() => {
        refreshList();
    }, [date])

    return (
        <div style={{width: "68%", marginLeft: "25%", padding: "5%"}}>
            <Grid container style={{marginBottom: "2%"}}>
                <Grid item xs={8}>
                    <Typography variant="h4">
                        Historia wizyt
                    </Typography>
                </Grid>
                {/*<Grid item xs={2}>*/}
                {/*    <DatePicker*/}
                {/*        wrapperClassName="datePicker"*/}
                {/*        selected={date}*/}
                {/*        onChange={(e: Date) => setDate(e)}/>*/}
                {/*</Grid>*/}
                <Grid item sm={4}>
                    <DatePicker
                        label="Data wizyty"
                        value={date}
                        onChange={e => {
                            if (e !== null) { setDate(e) }
                        }}
                        renderInput={(props) => <TextField fullWidth {...props} />}
                    />
                </Grid>
            </Grid>
            {wrongDate ?
                <>
                    <Typography variant="h6">
                        Aby przeglądać wizyty zaplanowane na przyszłość przejdź do zakładki <i>Zaplanowane wizyty</i>,
                        aby zobaczyć historię wizyt ustaw inną datę
                    </Typography>
                </> :
                <>
                    {visits.length !== 0 &&
                        <>
                            {visits.map((visit) => {
                                return (
                                    <VisitHistoryCard key={visit.id} id={visit.id}
                                                      visit_date={visit.date}
                                                      petName={visit.animal.name} isDoctor={true} note={visit.note}
                                                      refreshList={refreshList}
                                    />
                                )
                            })
                            }
                        </>
                    }
                </>
            }
        </div>
    )
}

export default DocVisitsHistory;

