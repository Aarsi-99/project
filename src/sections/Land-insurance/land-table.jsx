import React, { useState } from "react";
import {
  Box,
  Card,
  Fade,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import NextLink from "next/link";
import { ArrowRight } from "src/Icons/ArrowRight";
import { format, parseISO } from "date-fns";
import { moduleAccess } from "src/utils/module-access";
import { useDispatch, useSelector } from "react-redux";
import { CircleFill } from "src/Icons/CircleFill";
import { CrossSvg } from "src/Icons/CrossSvg";
import { styled } from "@mui/system";
import { useRouter } from "next/router";
import { SeverityPill } from "src/components/severity-pill";
import { setLandProposalSerchFilter, setTravelInfoId } from "./Proposals/Reducer/landInsuranceSlice";
import { setTravelAdminProposalVisitHistory } from "./Proposals/Action/landInsuranceAction";
import Link from "next/link";

const ToBeStyledTooltip = ({ className, ...props }) => (
  <Tooltip
    {...props}
    classes={{ tooltip: className }}
    slotProps={{
      popper: {
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, -10],
            },
          },
        ],
      },
    }}
    TransitionComponent={Fade}
    TransitionProps={{ timeout: 600 }}
  />
);
const StyledTooltip = styled(ToBeStyledTooltip)(({ theme }) => ({
  backgroundColor: "#f5f5f9",
  color: "#fff",
  fontWeight: 600,
  border: "1px solid white",
}));

const LandTable = (props) => {
  const dispatch = useDispatch();
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    landProposalSearchFilter = {},
    selected = [],
  } = props;
  const { loginUserData: user } = useSelector((state) => state.auth);

  const router = useRouter();

  const onClickHandler = () => {
    dispatch(setLandProposalSerchFilter({ ...landProposalSearchFilter, scrollPosition: window?.scrollY }));
  };
  // console.log(items, "items");
  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Proposal No</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Mobile No</TableCell>
                  <TableCell>Is Paid</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items?.length > 0 &&
                  items?.map((ele) => {
                    const isSelected = selected.includes(ele?._id);
                    const createdAt = format(parseISO(ele?.createdAt), "dd/MM/yyyy HH:mm");
                    return (
                      <TableRow
                        sx={{
                          textDecoration: "none",
                          backgroundColor:
                            ele?.policyId?.status == "Active"
                              ? "rgba(0, 0, 255, 0.1)"
                              : ele?.paymentId
                              ? "rgba(255,165,0, 0.15)"
                              : ele?.proposalStatus === "Un Attended"
                              ? "rgba(255, 0, 0, 0.1)"
                              : ele?.proposalStatus === "Customer contacted" && ele?.reason === "Didn’t pick up"
                              ? "rgba(255,255,0,0.15)"
                              : ele?.proposalStatus === "Referred to insurance company" ||
                                ele?.proposalStatus === "Customer contacted" ||
                                ele?.proposalStatus === "Customer Didn't picked up" ||
                                ele?.proposalStatus === "Document Requested" ||
                                ele?.proposalStatus === "Under Process" ||
                                ele?.proposalStatus === "Customer Picked"
                              ? "rgba(255,165,0, 0.15)"
                              : ele?.proposalStatus === "Lost"
                              ? "rgba(255, 0, 0, 0.1)"
                              : "rgba(255, 0, 0, 0.1)",
                          "&:hover": {
                            backgroundColor:
                              ele?.policyId?.status == "Active"
                                ? "rgba(0, 0, 255, 0.2) !important"
                                : ele?.paymentId
                                ? "rgba(255,165,0, 0.25) !important"
                                : ele?.proposalStatus === "Un Attended"
                                ? "rgba(255, 0, 0, 0.2)"
                                : ele?.proposalStatus === "Customer contacted" && ele?.reason === "Didn’t pick up"
                                ? "rgba(255,255,0,0.30)"
                                : ele?.proposalStatus === "Referred to insurance company" ||
                                  ele?.proposalStatus === "Customer contacted" ||
                                  ele?.proposalStatus === "Customer Didn't picked up" ||
                                  ele?.proposalStatus === "Document Requested" ||
                                  ele?.proposalStatus === "Under Process" ||
                                  ele?.proposalStatus === "Customer Picked"
                                ? "rgba(255,165,0, 0.25)"
                                : ele?.proposalStatus === "Lost"
                                ? "rgba(255, 0, 0, 0.2)"
                                : "rgba(255, 0, 0, 0.2)",
                          },
                          cursor: "pointer",
                        }}
                        // onClick={() => {
                        //   dispatch(setTravelInfoId()).then(() => {
                        //     router.push(`/travel-insurance/proposals/${ele?.proposalId}`);
                        //   });
                        // }}
                        href={`/land-insurance/proposals/${ele?._id}`}
                        component={Link}
                        onClick={() => {
                          onClickHandler();
                        }}
                      >
                        <TableCell>{ele?.proposalId}</TableCell>
                        <TableCell>{ele?.fullName?.[0]}</TableCell>
                        <TableCell>{ele?.email}</TableCell>
                        <TableCell>{ele?.mobileNumber}</TableCell>
                        <TableCell>
                          <SeverityPill sx={{ fontSize: "10px" }} color={ele?.isPaid ? "success" : "error"}>
                            {ele?.isPaid ? "Yes" : "No"}
                          </SeverityPill>
                        </TableCell>

                        <TableCell>
                          {ele?.policyId?.status == "Active" ? (
                            <StyledTooltip
                              sx={{
                                backgroundColor: "rgba(0, 0, 255, 0.8)",
                              }}
                              TransitionComponent={Fade}
                              TransitionProps={{ timeout: 600 }}
                              title="Policy Issued"
                            >
                              <CircleFill
                                sx={{
                                  color: "rgba(0, 0, 255, 0.8)",
                                  fontSize: "22px",
                                }}
                              />
                            </StyledTooltip>
                          ) : ele?.paymentId ? (
                            <StyledTooltip
                              sx={{
                                backgroundColor: "#FFA500",
                              }}
                              TransitionComponent={Fade}
                              TransitionProps={{ timeout: 600 }}
                              title="Policy Generated"
                            >
                              <CircleFill
                                sx={{
                                  color: "#FFA500",
                                  opacity: 0.8,
                                  fontSize: "22px",
                                }}
                              />
                            </StyledTooltip>
                          ) : ele?.proposalStatus === "Un Attended" ? (
                            <StyledTooltip
                              sx={{
                                backgroundColor: "rgba(255, 0, 0, 0.8)",
                              }}
                              title={`${ele?.proposalStatus}`}
                            >
                              <CircleFill sx={{ color: "rgba(255, 0, 0, 0.8)", fontSize: "22px" }} />
                            </StyledTooltip>
                          ) : ele?.proposalStatus === "Customer contacted" && ele?.reason === "Didn’t pick up" ? (
                            <StyledTooltip
                              sx={{
                                backgroundColor: "#ffff00",
                                color: "#000",
                              }}
                              title={`${ele?.proposalStatus} - ${ele?.reason}`}
                            >
                              <CircleFill sx={{ color: "#ffff00", opacity: 1, fontSize: "22px" }} />
                            </StyledTooltip>
                          ) : ele?.proposalStatus === "Referred to insurance company" ||
                            ele?.proposalStatus === "Customer contacted" ||
                            ele?.proposalStatus === "Customer Didn't picked up" ||
                            ele?.proposalStatus === "Document Requested" ||
                            ele?.proposalStatus === "Under Process" ||
                            ele?.proposalStatus === "Customer Picked" ? (
                            <StyledTooltip
                              sx={{
                                backgroundColor: "#FFA500",
                              }}
                              title={ele?.reason ? `${ele?.proposalStatus} - ${ele?.reason}` : `${ele?.proposalStatus}`}
                            >
                              <CircleFill sx={{ color: "#FFA500", opacity: 0.8, fontSize: "22px" }} />
                            </StyledTooltip>
                          ) : ele?.proposalStatus === "Lost" ? (
                            <StyledTooltip
                              sx={{
                                backgroundColor: "rgba(255, 0, 0, 0.8)",
                              }}
                              title={`${ele?.proposalStatus} - ${ele?.reason}`}
                            >
                              <CrossSvg sx={{ color: "red", opacity: 0.8, fontSize: "22px" }} />
                            </StyledTooltip>
                          ) : (
                            <StyledTooltip
                              sx={{
                                backgroundColor: "rgba(255, 0, 0, 0.8)",
                              }}
                              title={`${ele?.proposalStatus || "Un Attended"}`}
                            >
                              <CircleFill sx={{ color: "rgba(255, 0, 0, 0.8)", fontSize: "22px" }} />
                            </StyledTooltip>
                          )}
                        </TableCell>
                        <TableCell>{createdAt}</TableCell>

                        <TableCell align="right">
                          {moduleAccess(user, "landQuote.read") && (
                            <IconButton component="a">
                              <ArrowRight fontSize="small" />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>

        <TablePagination
          component="div"
          count={count}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
    </>
  );
};

export default LandTable;
