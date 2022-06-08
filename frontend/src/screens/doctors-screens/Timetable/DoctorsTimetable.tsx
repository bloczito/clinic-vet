import React, {useCallback, useEffect, useMemo, useState} from "react";
import VisitsCard from "./VisitsCard";
import {TextField, Typography} from "@mui/material";
import {Grid} from "@mui/material"
import {DatePicker} from "@mui/x-date-pickers";
import {doctorsApi} from "../../../api/doctors.api";
import {visitsApi} from "../../../api/visits.api";
import {Doctor, Visit} from "../../../types";
import moment, {Moment} from "moment";
import {useSnackbar} from "notistack";


const DoctorsTimetable: React.FC = () => {

    const {enqueueSnackbar} = useSnackbar()
    const [date, setDate] = useState<Moment>(moment());
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [visits, setVisits] = useState<Visit[]>([])
    const [doctorId, setDoctorId] = useState<number | "">(0);
    const [selectedVisitId, setSelectedVisitId] = useState<number | null>(null);


    useEffect(() => {
        loadVisits()
    }, [date])

    const loadVisits = () => visitsApi.getVisitsDoctor(date).then(res => setVisits(res));

    const handleCancelVisit = (visitId: number) => {
        visitsApi.cancelVisit(visitId)
            .then(
                loadVisits,
                () => {
                    enqueueSnackbar("Nie udało się anulować wizyty", {variant: "error"})
                }
            )
    }

    return (
        <div style={{width: "68%", marginLeft: "25%", padding: "5%"}}>
            <Grid container style={{ marginBottom: "2%"}}>
                <Grid item xs={8}>
                    <Typography variant="h4">
                        Nadchodzące wizyty
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <DatePicker
                        label="Data"
                        value={date}
                        disablePast
                        onChange={(e) => {
                            if (e !== null){
                                setDate(e)
                            }
                        }}
                        renderInput={(props) => <TextField fullWidth {...props} />}
                    />
                </Grid>
           </Grid>
            {visits.length !== 0 &&
                <>
                    {visits.map((visit) => (
                             <VisitsCard
                                 key={visit.id}
                                 visit={visit}
                                 isDoctor={true}
                                 cancelVisitFn={handleCancelVisit}
                             />
                        )
                    )}
                </>
            }

        </div>
    )
}

export default DoctorsTimetable;

