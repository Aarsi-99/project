import { Card, Grid, InputAdornment, TextField, Typography, debounce } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import ListItemComp from "src/components/ListItemComp";
import { useRouter } from "next/router";
import { applyDiscountToTravelProposals } from "./Action/travelInsuranceAction";
import { getPromoCodeList } from "src/sections/Proposals/Action/proposalsAction";
import { toast } from "react-toastify";
import AnimationLoader from "src/components/amimated-loader";

export default function TravelPromoCodeSession({
  proposalId,
  items,
  fetchProposalSummary,
  isPurchased,
  setSelectedCheckboxes,
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [promoCodeList, setPromoCodeList] = useState([]);
  const [promoCode, setPromoCode] = useState(items?.voucher?.promoCode);
  const initial = useRef(false);
  const [loading, setLoading] = useState(false);

  // Get Promo Code List
  useEffect(() => {
    if (initial.current) {
      return;
    }
    initial.current = true;
    dispatch(getPromoCodeList({}))
      .unwrap()
      .then((res) => {
        setPromoCodeList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Apply Promo Code
  const handlePromoCodeChange = (e) => {
    setLoading(true);
    setPromoCode(e.target.value);
    const data = {
      promoCode: e.target.value,
    };
    dispatch(applyDiscountToTravelProposals({ proposalId: proposalId, data: data }))
      .unwrap()
      .then((res) => {
        setLoading(false);
        // dispatch(getQuotationListByProposalId({ id: proposalId }));
        fetchProposalSummary && fetchProposalSummary();
        toast.success("Voucher Applied");
        setSelectedCheckboxes([]);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
        setLoading(false);
      });
  };

  // Apply Discount
  const handleDiscountChange = (value) => {
    dispatch(
      applyDiscountToProposals({
        proposalId: proposalId,
        data: { discountValue: value },
      })
    )
      .unwrap()
      .then((res) => {
        // dispatch(getQuotationListByProposalId({ id: proposalId }));
        fetchProposalSummary && fetchProposalSummary();
        toast.success("Discount Applied");
        setSelectedCheckboxes([]);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      });
  };

  const debounceHandler = debounce(handleDiscountChange, 1000);

  return (
    <>
      {loading && <AnimationLoader open={true} />}
      <Box mb={2} mt={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Card>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{
                  width: "100%",
                  py: 1.5,
                  backgroundColor: "#f5f5f5",
                  mb: 1,
                  fontWeight: "600",
                  fontSize: "18px",
                  display: "inline-block",
                  color: "#60176F",
                  px: "14px",
                }}
              >
                Voucher Detail
              </Typography>
              <Box sx={{ p: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ marginTop: "5px" }}>
                      <TextField
                        fullWidth
                        label="Promo Code"
                        name="promoCode"
                        disabled={isPurchased}
                        onChange={(e) => handlePromoCodeChange(e)}
                        select
                        SelectProps={{ native: true }}
                        value={promoCode}
                      >
                        <option value=""></option>
                        {promoCodeList.map((p) => {
                          return <option value={p.promoCode}>{p.promoCode}</option>;
                        })}
                      </TextField>
                    </Box>
                    <Box sx={{ padding: "10px 0", mb: 1 }}>
                      {items?.voucher ? (
                        <Grid container columnSpacing={4} sx={{ width: { xs: "100%", sm: "90%", xl: "50%" } }}>
                          <Grid item xs={12}>
                            <ListItemComp label={"Promo Code"} value={items?.voucher?.promoCode || "-"} />
                          </Grid>
                          <Grid item xs={12}>
                            <ListItemComp
                              label={"Code Discount"}
                              value={
                                `${items?.voucher?.discountValue} ${
                                  items?.voucher?.discountType === "percentage" ? "%" : "AED"
                                }` || "-"
                              }
                            />
                          </Grid>
                        </Grid>
                      ) : (
                        <Typography sx={{ ml: 2 }}>
                          {router?.asPath?.split("/")?.includes("quotations")
                            ? "Voucher is not added in this quotation"
                            : "Voucher is not added in this proposal"}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
