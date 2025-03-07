import React, { useRef, useState, useEffect } from "react";
import { Box, Card, OutlinedInput, TextField, InputAdornment, SvgIcon, Grid, Button, Autocomplete } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import format from "date-fns/format";
import { toast } from "react-toastify";
import { addMilliseconds } from "date-fns";
import { getAllAgentlist } from "src/sections/Proposals/Action/proposalsAction";
import { useDispatch } from "react-redux";

const HealthPolicyFilterCard = ({
  searchFilter,
  searchFilterHandler,
  inputPlaceHolder,
  selectOptions,
  FilterDataHandler,
  statusOptions,
  QuotationTypeoption,
  exportCSVFile,
  exportCSVFilePraktora,
}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(searchFilter?.toDate || "");
  const dispatch = useDispatch();
  const [agentList, setAgentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const initial = useRef(false);
  useEffect(() => {
    if (initial.current) {
      return;
    }
    initial.current = true;
    dispatch(getAllAgentlist({}))
      .unwrap()
      .then((res) => {
        setAgentList(res?.data);
      })
      .catch((err) => {
        console.log(err, "err");
      });
  }, []);

  //For Agent Mapping
  const mappedAgentList = agentList?.map((agent) => {
    return {
      label: agent.userId?.fullName,
      id: agent.userId?._id,
    };
  });

  return (
    <Card sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={2}>
          <Box sx={{ display: "inline-block", width: "100%" }}>
            <OutlinedInput
              defaultValue={searchFilter?.name || ""}
              fullWidth
              name="name"
              placeholder={inputPlaceHolder || ""}
              onChange={(e) => searchFilterHandler(e.target.name, e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <SvgIcon color="action" fontSize="small">
                    <MagnifyingGlassIcon />
                  </SvgIcon>
                </InputAdornment>
              }
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={10}>
          <Box sx={{ display: "flex" }}>
            <Grid container spacing={2}>
              <Grid
                item
                xs={12}
                sm={0}
                md={selectOptions && (statusOptions || QuotationTypeoption) ? 1 : selectOptions ? 1 : 7}
              />

              <Grid item xs={12} sm={4} md={2}>
                <Box sx={{ display: "flex" }}>
                  <DatePicker
                    inputFormat="dd-MM-yyyy"
                    label="From"
                    onChange={(value) => {
                      if (value != "Invalid Date" && value) {
                        setStartDate(value);
                        FilterDataHandler("fromDate", value.toISOString());
                      }
                    }}
                    renderInput={(params) => <TextField name="fromDate" fullWidth {...params} error={false} />}
                    value={searchFilter?.fromDate}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sm={4} md={2}>
                <DatePicker
                  inputFormat="dd-MM-yyyy"
                  label="To"
                  onChange={(value) => {
                    if (value != "Invalid Date" && value) {
                      setEndDate(value.toISOString());
                      const newDate = addMilliseconds(new Date(value), 24 * 60 * 60 * 1000 - 1);
                      FilterDataHandler("toDate", newDate.toISOString());
                    }
                  }}
                  renderInput={(params) => <TextField name="toDate" fullWidth {...params} error={false} />}
                  value={new Date(endDate)}
                />
              </Grid>

              <Grid item sx={12} sm={4} md={2}>
                <Autocomplete
                  id="agentId"
                  options={mappedAgentList}
                  label="Agents"
                  loading={false}
                  value={mappedAgentList?.find((i) => i?.id == searchFilter?.agent) || ""}
                  onChange={(e, value) => {
                    FilterDataHandler("agent", value?.id);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Agents"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: <React.Fragment>{params.InputProps.endAdornment}</React.Fragment>,
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={0} md={1}>
                <Box
                  sx={{
                    display: "flex",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => {
                      if (startDate > endDate) {
                        toast("Invalid selected date", {
                          type: "error",
                        });
                      } else {
                        searchFilterHandler();
                      }
                    }}
                    disabled={searchFilter?.fromDate === "" || searchFilter?.toDate === ""}
                  >
                    Filter
                  </Button>
                </Box>
              </Grid>

              {selectOptions && (
                <Grid item xs={12} sm={4} md={4}>
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    {exportCSVFile && (
                      <Box>
                        <Button
                          sx={{ fontSize: "14px" }}
                          variant="contained"
                          onClick={() => {
                            if (startDate > endDate) {
                              toast("Invalid selected date", {
                                type: "error",
                              });
                            } else {
                              exportCSVFile();
                            }
                          }}
                          disabled={searchFilter?.fromDate === "" || searchFilter?.toDate === ""}
                        >
                          Export
                        </Button>
                      </Box>
                    )}

                    {exportCSVFilePraktora && (
                      <Box>
                        <Button
                          sx={{ fontSize: "14px", whiteSpace: "nowrap" }}
                          variant="contained"
                          onClick={() => {
                            if (startDate > endDate) {
                              toast("Invalid selected date", {
                                type: "error",
                              });
                            } else {
                              exportCSVFilePraktora();
                            }
                          }}
                          disabled={searchFilter?.fromDate === "" || searchFilter?.toDate === ""}
                        >
                          Extra Export
                        </Button>
                      </Box>
                    )}

                    <TextField
                      fullWidth
                      label="Type"
                      name="type"
                      onChange={(e) => {
                        searchFilterHandler(e.target.name, e.target.value);
                      }}
                      select
                      SelectProps={{ native: true }}
                      value={searchFilter?.type}
                    >
                      {selectOptions.map((option) => (
                        <option key={option?.value} value={option?.value}>
                          {option?.label}
                        </option>
                      ))}
                    </TextField>
                  </Box>
                </Grid>
              )}

              {statusOptions && (
                <Grid item xs={12} sm={4} md={2}>
                  <TextField
                    fullWidth
                    label="Status"
                    name="status"
                    onChange={(e) => {
                      searchFilterHandler(e.target.name, e.target.value);
                    }}
                    select
                    SelectProps={{ native: true }}
                    value={searchFilter?.status}
                  >
                    {statusOptions.map((option) => (
                      <option key={option?.value} value={option?.value}>
                        {option?.label}
                      </option>
                    ))}
                  </TextField>
                </Grid>
              )}
              {QuotationTypeoption && (
                <Grid item xs={12} sm={4} md={2}>
                  <TextField
                    fullWidth
                    label="Quotation Type"
                    name="insuranceType"
                    onChange={(e) => {
                      searchFilterHandler(e.target.name, e.target.value);
                    }}
                    select
                    SelectProps={{ native: true }}
                    value={searchFilter?.insuranceType}
                  >
                    {QuotationTypeoption.map((option) => (
                      <option key={option?.value} value={option?.value}>
                        {option?.label}
                      </option>
                    ))}
                  </TextField>
                </Grid>
              )}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};

export default HealthPolicyFilterCard;
