import React, {useCallback, useEffect, useMemo, useState} from "react";
import VisitsCard from "./doctors-screens/Timetable/VisitsCard";
import {Typography} from "@mui/material";
import {Grid} from "@mui/material"
import DatePicker from "react-datepicker";
import {Visit} from "../types/visit.types"
import {useSnackbar} from "notistack";
import {animalsApi} from "../api/animals.api";
import {visitsApi} from "../api/visits.api";


const VisitsPlanUser: React.FC = () => {

    const [date, setDate] = useState<Date>();
    const [visits, setVisits] = useState<Visit[]>([])
    const {enqueueSnackbar} = useSnackbar();
    // const [doctorId, setDoctorId] = useState<number | "">(0);
    // const [selectedVisitId, setSelectedVisitId] = useState<number | null>(null);

     const loadVisits = () => animalsApi.getVisits().then(results  => setVisits(results))

    useEffect(() => {
        loadVisits()
    }, [])


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

           </Grid>
            {visits.length !== 0 &&
                <>
                    {visits.map((visit) => (
                              <VisitsCard
                                  visit={visit}
                                  isDoctor={false}
                                  cancelVisitFn={handleCancelVisit}
                              />
                        )
                    )}
                </>
            }

        </div>
    )
}

export default VisitsPlanUser;
