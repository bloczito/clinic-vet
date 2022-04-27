import React, {useCallback, useEffect, useMemo, useState} from "react";
import {
    Box,
    Button,
    Container,
    FormControl,
    Grid, IconButton,
    InputLabel,
    MenuItem,
    Select,
    SelectProps,
    Typography
} from "@mui/material";
import moment, {Moment} from "moment";
import WeekPicker from "../components/WeekPicer/WeekPicker";
import {DailyVisits, Doctor, Visit} from "../types";
import {doctorsApi} from "../api/doctors.api";
import {visitsApi} from "../api/visits.api";
import VisitTimePicker from "../components/VisitTimePicker/VisitTimePicker";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


const CustomSelect: React.FC<SelectProps> = ({label, value, onChange, children, ...props}) => (
    <FormControl fullWidth>
        <InputLabel id={`schedule-${label}-select-label`}>{label}</InputLabel>
        <Select
            labelId="doctor-select-label"
            label={label}
            fullWidth
            value={value}
            onChange={onChange}
            {...props}
        >
            <MenuItem value={""}>Brak</MenuItem>
            {children}
        </Select>
    </FormControl>
);


const ScheduleVisit: React.FC = () => {
    const [doctorId, setDoctorId] = useState<number | "">("");
    const [selectedDate, setSelectedDate] = useState<Moment>(moment());
    const [selectedVisitId, setSelectedVisitId] = useState<number | null>(null);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [visits, setVisits] = useState<Visit[]>([])

    useEffect(() => {
        doctorsApi.getAllDoctors().then(res => setDoctors(res));
    }, [])

    useEffect(() => {
        if (doctorId !== "") {

            visitsApi
                .getVisits(doctorId, moment(selectedDate).startOf("week"), moment(selectedDate).endOf("week"))
                .then(res => setVisits(res));
        }

        setSelectedVisitId(null)
    }, [selectedDate, doctorId])


    const datesMap: DailyVisits[] = useMemo(() => {
        const start = moment(selectedDate).startOf("week");
        const end = moment(selectedDate).endOf("week");

        const dates = []
        for (; start.isSameOrBefore(end); start.add(1, "day")) {
            dates.push(moment(start))
        }

        return dates
            .map(date => ({
                date,
                visits: visits.filter(v => v.date.isSame(date, "date"))
            }))

    }, [visits]);

    const handleSelectVisit = useCallback((visitId: number) => setSelectedVisitId(visitId), []);

    const handlePlusMinusDate = useCallback((type: "plus" | "minus") => {
        if (type === "plus") {
            setSelectedDate(prev => moment(prev).add(1, "week"))
        } else {
            setSelectedDate(prev => moment(prev).subtract(1, "week"))
        }
    }, []);


    return (
        <div style={{width: "68%", marginLeft: "25%", padding: "5%"}}>
            <Typography variant="h4">
                Zaplanuj wizytę
            </Typography>

            <Grid container sx={{marginTop: 5}} gap={5}>
                <Grid item sm={4}>
                    <CustomSelect
                        label="Lekarz"
                        onChange={e => setDoctorId(e.target.value !== "" ? e.target.value as number : "")}
                        value={doctorId}
                    >
                        {doctors.map(({id, firstName, lastName}) => (
                            <MenuItem key={id} value={id}>
                                {firstName} {lastName}
                            </MenuItem>
                        ))}
                    </CustomSelect>
                </Grid>

                <Grid item sm={5}>
                    <Grid container justifyContent="end">
                        <Button
                            variant="contained"
                            disableElevation
                            size="large"
                        >
                            Zaplanuj wizytę
                        </Button>
                    </Grid>
                </Grid>
            </Grid>

            <Grid container sx={{marginTop: 5}} gap={5}>
                <Grid item sm={4}>
                    <WeekPicker
                        label="Data"
                        date={selectedDate}
                        onChange={v => setSelectedDate(v)}
                    />
                </Grid>

                <Grid item>
                    <IconButton
                        size="large"
                        onClick={() => handlePlusMinusDate("minus")}
                    >
                        <ArrowBackIcon/>
                    </IconButton>

                    <IconButton
                        size="large"
                        onClick={() => handlePlusMinusDate("plus")}
                    >
                        <ArrowForwardIcon/>
                    </IconButton>
                </Grid>
            </Grid>

            {doctorId ? (
                <Grid container sx={{marginTop: 5}} gap={5}>
                    {datesMap.map((dv) => (
                        <Grid key={dv.date.toISOString()} sm={1}>
                            <VisitTimePicker
                                dayAndVisits={dv}
                                selectedVisit={selectedVisitId}
                                selectVisit={handleSelectVisit}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Grid container justifyContent="center" marginTop={10}>
                    <Typography variant="h5">
                        Wybierz lekarza
                    </Typography>
                </Grid>
            )}
        </div>
    )
}

export default ScheduleVisit;
