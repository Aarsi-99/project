import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  styled,
  Skeleton,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { Scrollbar } from "src/components/scrollbar";
import CloseIcon from "@mui/icons-material/Close";
import NextLink from "next/link";
import { ArrowRight } from "src/Icons/ArrowRight";
import { formatNumber } from "src/utils/formatNumber";
import { formateWithoutDasimal } from "src/utils/formateWithoutDasimal";

const TableCells = styled(TableCell)(({ theme }) => ({
  fontSize: 12.5,
}));

function HealthInsuranceCompanyPolicy({
  handleClose,
  items = [],
  rowsPerPage,
  page,
  companyData,
  onRowsPerPageChange,
  onPageChange,
  count,
  loadingTop,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 2,
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          cursor: "pointer",
          width: "100%",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px" }}>
          <Typography variant="h6">Insurance Company Policy</Typography>
          <Box onClick={() => handleClose()}>
            <CloseIcon />
          </Box>
        </Box>
        {!loadingTop ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Company Name</TableCell>
                <TableCell>No of Proposals</TableCell>
                <TableCell>No of Policies</TableCell>
                <TableCell>Conversion Ratio</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <>
                <TableRow sx={{ cursor: "default" }}>
                  <TableCell>
                    {companyData?.conversionRatios?.company || companyData?.noOfProposalsCompanyWise?.company || "-"}
                  </TableCell>
                  <TableCell>
                    {companyData?.noOfProposalsCompanyWise?.noOfProposals
                      ? formateWithoutDasimal(companyData?.noOfProposalsCompanyWise?.noOfProposals)
                      : "0"}
                  </TableCell>
                  <TableCell>
                    {companyData?.conversionRatios?.noOfPolicies
                      ? formateWithoutDasimal(companyData?.conversionRatios?.noOfPolicies)
                      : "0"}
                  </TableCell>
                  <TableCell>
                    {companyData?.conversionRatios?.conversionRatio
                      ? `${formatNumber(companyData?.conversionRatios?.conversionRatio)}%`
                      : "0%"}
                  </TableCell>
                </TableRow>
              </>
            </TableBody>
          </Table>
        ) : (
          <Skeleton height={110} />
        )}

        <Scrollbar>
          <Box sx={{ minWidth: 700, mt: 3 }}>
            {items?.length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ref No.</TableCell>
                    <TableCell>Policy number</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Premium</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {items?.map((ele, idx) => {
                    return (
                      <TableRow key={idx}>
                        <TableCells>{ele?.quoteId?.proposalNo}</TableCells>
                        <TableCells>{ele?.companyPolicyNumber || ele?.policyNumber || "-"}</TableCells>
                        <TableCells>
                          {ele?.quoteId?.insuranceType == "thirdparty" ? "Third Party" : "Comprehensive"}
                        </TableCells>
                        <TableCells>{`AED ${formatNumber(ele?.quoteId?.price)}`}</TableCells>
                        <TableCells>
                          <NextLink href={`/health-insurance/policies/${ele?._id}`} passHref>
                            <IconButton component="a">
                              <ArrowRight fontSize="small" />
                            </IconButton>
                          </NextLink>
                        </TableCells>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "100px",
                  width: "100%",
                }}
              >
                <CircularProgress />
              </Box>
            )}
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
    </Box>
  );
}

export default HealthInsuranceCompanyPolicy;
