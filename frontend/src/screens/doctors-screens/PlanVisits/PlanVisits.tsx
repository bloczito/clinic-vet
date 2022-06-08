import React, {useEffect, useState} from "react";
import {
    Button,
    Grid, InputAdornment,
    Typography
} from "@mui/material";
import moment, {Moment} from "moment";
import {doctorsApi} from "../../../api/doctors.api";
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {DoctorsVisit} from "../../../types/doctorsvisit";
import "react-datepicker/dist/react-datepicker.css";
import "./PlanVisits.css";
import { DatePicker } from "@mui/x-date-pickers";
import { log } from "util";
import { useSnackbar } from "notistack";


const PlanVisits: React.FC = () => {
    const [selectedDateFrom, setSelectedDateFrom] = useState<Moment>(moment());
    const [selectDateTo, setSelectDateTo] = useState<Moment>(moment());
    const [selectHourForm, setSelectHourFrom] = useState<string>('8:00')
    const [selectHourTo, setSelectHourTo] = useState<string>('18:00');
    const timeRegex = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/
    const [errorHourTo, setErrorHourTo] = useState<boolean>(false);
    const [errorHourFrom, setErrorHourFrom] = useState<boolean>(false);
    const [appointmentTime, setAppointmentTime] = useState<string>('15');
    const [breakTime, setBreakTime] = useState<string>('5');
    const [days, setDays] = useState<string[]>([]);
    const [addDisabled, setAddDisabled] = useState(false);

    const {enqueueSnackbar} = useSnackbar()

    useEffect(() => {
        if(selectHourTo.match(timeRegex)){
            setErrorHourTo(false);
        } else {
            setErrorHourTo(true)
        }
    },[selectHourTo])

    useEffect(() => {
        if(selectHourForm.match(timeRegex)){
            setErrorHourFrom(false);
        } else {
            setErrorHourFrom(true)
        }
    },[selectHourForm])

    useEffect(() => {
        if(errorHourFrom || errorHourTo || days.length === 0){
            setAddDisabled(true)
        } else {
            setAddDisabled(false)
        }
    },[errorHourFrom, errorHourTo, days])

    const handleDays = (event: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
            setDays(newFormats);
    };


    const handleClick = () => {
        setAddDisabled(true)
        let visit: DoctorsVisit = {
            dateFrom: selectedDateFrom.format("YYYY-MM-DD"),
            dateTo: selectDateTo.format("YYYY-MM-DD"),
            timeFrom: selectHourForm,
            timeTo: selectHourTo,
            visitTime: appointmentTime,
            breakTime: breakTime,
            repeatEvery: days,
        }
        doctorsApi.postDoctorVisit(visit)
            .then(
                res => enqueueSnackbar("Zaplanowano wizyty", {variant: "success"}),
                reason => enqueueSnackbar("Nie udało się zaplanować wizyt", {variant: "error"})
            )
    }


    return (
        <div style={{width: "68%", marginLeft: "25%", padding: "5%"}}>
            <Typography variant="h4">
                Dodaj wizyty
            </Typography>

            <Grid container sx={{marginTop: 5}} gap={5}>
                <Grid item sm={4}>
                    <DatePicker
                        label="Data od"
                        value={selectedDateFrom}
                        onChange={e => {
                            if (e !== null) { setSelectedDateFrom(e) }
                        }}
                        renderInput={(props) => <TextField fullWidth {...props} />}
                    />
                </Grid>
                <Grid item sm={4}>
                    <TextField style={{width: "100%"}} error={errorHourFrom} label="Od godz" value={selectHourForm} onChange={(e: any) => setSelectHourFrom(e.target.value)} />

                </Grid>
            </Grid>
            <Grid container sx={{marginTop: 5}} gap={5}>
                <Grid item sm={4}>
                    <DatePicker
                        label="Data do"
                        value={selectDateTo}
                        onChange={e => {
                            if (e !== null) { setSelectDateTo(e) }
                        }}
                        renderInput={(props) => <TextField fullWidth {...props} />}
                    />
                </Grid>
                <Grid item sm={4}>
                    <TextField style={{width: "100%"}} error={errorHourTo} label="Do godz" value={selectHourTo} onChange={(e:any) => setSelectHourTo(e.target.value)}/>
                </Grid>
            </Grid>
                <Grid container sx={{marginTop: 5}} gap={5}>
                    <Grid item sm={4}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Długość wiyty</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={appointmentTime}
                          label="Długość wiyty"
                          onChange={(event: SelectChangeEvent) => {setAppointmentTime(event.target.value as string)}}
                          startAdornment={
                            <InputAdornment sx={{marginRight: 2}} position="end">
                                min.
                            </InputAdornment>
                          }
                        >
                          <MenuItem value={5}>5</MenuItem>
                          <MenuItem value={10}>10</MenuItem>
                          <MenuItem value={15}>15</MenuItem>
                          <MenuItem value={20}>20</MenuItem>
                          <MenuItem value={30}>30</MenuItem>
                        </Select>
                        </FormControl>
                    </Grid>
                    <Grid item sm={4}>
                    <FormControl fullWidth>
                        <InputLabel>Długość przerwy</InputLabel>
                        <Select
                          value={breakTime}
                          label="Długość przerwy"
                          onChange={(event: SelectChangeEvent) => {setBreakTime(event.target.value as string)}}
                          startAdornment={
                              <InputAdornment sx={{marginRight: 2}} position="end">
                                  min.
                              </InputAdornment>
                          }
                        >
                          <MenuItem value={5}>5</MenuItem>
                          <MenuItem value={10}>10</MenuItem>
                          <MenuItem value={15}>15</MenuItem>
                          <MenuItem value={20}>20</MenuItem>
                          <MenuItem value={30}>30</MenuItem>
                        </Select>
                        </FormControl>
                        </Grid>
                </Grid>
            <Grid container sx={{marginTop: 5}}>
            <Typography variant="h5">
                Powtarzaj co każdy:
                </Typography>
            </Grid>
            <Grid container sx={{marginTop: 5}} gap={5}>
                <ToggleButtonGroup
                  value={days}
                  onChange={handleDays}
                  aria-label="text formatting"
                >
                  <ToggleButton value="monday">
                    Poniedziałek
                  </ToggleButton>
                  <ToggleButton value="tuesday">
                    Wtorek
                  </ToggleButton>
                  <ToggleButton value="wednesday">
                    Środa
                  </ToggleButton>
                     <ToggleButton value="thursday">
                    Czwartek
                  </ToggleButton>
                     <ToggleButton value="friday">
                    Piątek
                  </ToggleButton>
                     <ToggleButton value="saturday">
                    Sobota
                  </ToggleButton>
                     <ToggleButton value="sunday">
                    Niedziela
                  </ToggleButton>
                </ToggleButtonGroup>
            </Grid>
            <Grid container sx={{marginTop: 5}} gap={5}>
               <Button
                  variant="contained"
                  disabled={addDisabled}
                  size="large"
                  onClick={handleClick}
               >
                   Zaplanuj wizyty
               </Button>
            </Grid>
        </div>
    )
}

export default PlanVisits;

