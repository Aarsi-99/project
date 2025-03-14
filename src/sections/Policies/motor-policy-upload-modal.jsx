import React, { useState } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { Box, Button, CardHeader, Grid, IconButton, TextField, Typography } from "@mui/material";
import * as yup from "yup";
import ModalComp from "src/components/modalComp";
import { DocumentSvg } from "src/Icons/DocumentSvg";
import { jsonToFormData } from "src/utils/convert-to-form-data";
import { getCustomerPolicyDetailById, postCustomerPolicyDocByCustomerId } from "../customer/action/customerAction";
import {
  getHealthPolicyDetailById,
  uploadHealthPolicyFile,
} from "../health-insurance/Policies/action/healthPoliciesAction";
import { uploadLandInsurancePolicyFile } from "../Land-insurance/Proposals/Action/landInsuranceAction";
import {
  uploadMotorFleetePolicyFile,
  getMotorFleetPolicyDetailById,
} from "../motor-fleet/Policies/action/motorFleetPoliciesAction";
import { getLandPolicyDetailById } from "../Land-insurance/Policies/action/landPoliciesAction";

const MotorPolicyUploadModal = ({ handleEditPolicyNoClose, customerPolicyDetails, keyName, newPolicyId = "" }) => {
  const dispatch = useDispatch();

  const router = useRouter();
  const { policyId } = router.query;

  const [open, setOpen] = useState(false);
  const [filename, _filename] = useState("");
  const [payloadValue, setPayloadValue] = useState(null);
  const handleClose = () => setOpen(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      companyPolicyNumber: customerPolicyDetails?.companyPolicyNumber || "",
      policy: "",
    },

    validationSchema: yup.object({
      companyPolicyNumber: yup.string().required("Policy Number is required"),
      policy: yup.mixed().required("File required"),
    }),

    onSubmit: async (values) => {
      setPayloadValue(values);
      setOpen(true);
    },
  });

  const onSubmitPayload = () => {
    const formData = jsonToFormData(payloadValue);

    if (customerPolicyDetails && keyName == "Car-Policy") {
      dispatch(
        postCustomerPolicyDocByCustomerId({
          id: policyId,
          data: formData,
        })
      )
        .unwrap()
        .then((res) => {
          if (res) {
            toast("Successfully uploaded", {
              type: "success",
            });
            dispatch(getCustomerPolicyDetailById(policyId));
            handleEditPolicyNoClose();
            handleClose();
          }
        })
        .catch((err) => {
          toast(err, {
            type: "error",
          });
        });
    }
    if (customerPolicyDetails && keyName == "Health-Policy") {
      dispatch(
        uploadHealthPolicyFile({
          id: policyId,
          data: formData,
        })
      )
        .unwrap()
        .then((res) => {
          if (res) {
            toast("Successfully uploaded", {
              type: "success",
            });
            dispatch(getHealthPolicyDetailById(policyId));
            handleEditPolicyNoClose();
            handleClose();
          }
        })
        .catch((err) => {
          toast(err, {
            type: "error",
          });
        });
    }
    if (customerPolicyDetails && keyName == "Land-Policy") {
      dispatch(
        uploadLandInsurancePolicyFile({
          id: policyId || newPolicyId,
          data: formData,
        })
      )
        .unwrap()
        .then((res) => {
          if (res) {
            toast("Successfully uploaded", {
              type: "success",
            });
            dispatch(getLandPolicyDetailById(policyId));
            handleEditPolicyNoClose();
            handleClose();
          }
        })
        .catch((err) => {
          toast(err, {
            type: "error",
          });
        });
    }
    if (customerPolicyDetails && keyName == "motorFleet-Policy") {
      dispatch(
        uploadMotorFleetePolicyFile({
          id: policyId || newPolicyId,
          data: formData,
        })
      )
        .unwrap()
        .then((res) => {
          if (res) {
            toast("Successfully uploaded", {
              type: "success",
            });
            dispatch(getMotorFleetPolicyDetailById(policyId));
            handleEditPolicyNoClose();
            handleClose();
          }
        })
        .catch((err) => {
          toast(err, {
            type: "error",
          });
        });
    }
  };

  const fileUploadHandler = (event) => {
    _filename(event?.currentTarget?.files[0]?.name);
    formik.setFieldValue("policy", event.currentTarget.files[0]);
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <CardHeader title="Update policy PDF" sx={{ p: 0, mb: 1 }} />

        <Typography
          variant="subtitle2"
          gutterBottom
          sx={{
            color: "#707070",
            fontSize: "13px",
            fontWeight: "500",
            cursor: "pointer",
            mb: 1,
          }}
        >
          {`Ref Number ${customerPolicyDetails?.policyNumber}`}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              error={Boolean(formik.touched.companyPolicyNumber && formik.errors.companyPolicyNumber)}
              fullWidth
              helperText={formik.touched.companyPolicyNumber && formik.errors.companyPolicyNumber}
              label="Insurance Company Policy Number "
              name="companyPolicyNumber"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.companyPolicyNumber}
            />
          </Grid>

          <Grid item xs={12}>
            <IconButton
              color="#707070"
              backgroundColor="none"
              aria-label="upload picture"
              component="label"
              disableRipple
              sx={{
                flexDirection: "column",
                cursor: "pointer",
                "&:hover": {
                  background: "none",
                },
                p: 0,
              }}
            >
              <input
                accept=".pdf"
                id="file"
                type="file"
                name="file"
                onChange={(event) => {
                  fileUploadHandler(event);
                }}
                onBlur={formik.handleBlur}
                style={{ display: "none" }}
              />
              <DocumentSvg sx={{ fontSize: "70px" }} />

              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{
                  color: "#707070",
                  fontSize: "12px",
                  fontWeight: "600",
                  textDecoration: "underline",
                  mt: 0.5,
                  cursor: "pointer",
                }}
              >
                click to upload
              </Typography>
            </IconButton>

            {formik.errors.policy && (
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{
                  color: "red",
                  fontSize: "12px",
                  fontWeight: "600",
                  mt: 0.5,
                  cursor: "pointer",
                }}
              >
                {formik.errors.policy}
              </Typography>
            )}
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{
                color: "#ccc",
                fontSize: "12px",
                fontWeight: "600",
                mt: 0.5,
                cursor: "pointer",
              }}
            >
              {filename || customerPolicyDetails?.policyFile?.originalname}
            </Typography>
          </Grid>
        </Grid>

        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
          mt={3}
        >
          <Button type="button" variant="contained" onClick={formik.handleSubmit}>
            Update
          </Button>

          <Button variant="outlined" type="button" onClick={() => handleEditPolicyNoClose()}>
            Cancel
          </Button>
        </Box>

        <ModalComp open={open} handleClose={handleClose} width="44rem">
          <CardHeader title="Are you sure you want to change?" sx={{ p: 0, mb: 2 }} />

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="contained" onClick={onSubmitPayload}>
              Sure
            </Button>

            <Button variant="outlined" type="button" onClick={() => handleClose()}>
              Cancel
            </Button>
          </Box>
        </ModalComp>
      </form>
    </>
  );
};

export default MotorPolicyUploadModal;
