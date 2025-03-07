import React, { useEffect, useRef, useState } from "react";
import NextImage from "next/image";
import { Box, Container, Stack, Typography, Grid, styled, Button, SvgIcon } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { getAllCarCompanies, deleteCompanyById } from "../../sections/companies/action/companyAcrion";
import { useDispatch, useSelector } from "react-redux";
import NextLink from "next/link";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import EditIcon from "@heroicons/react/24/solid/PencilIcon";
import ExternalLinkIcon from "@heroicons/react/24/solid/LinkIcon";
import { moduleAccess } from "src/utils/module-access";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import ModalComp from "src/components/modalComp";
import AnimationLoader from "src/components/amimated-loader";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const Img = styled(NextImage)(({ theme }) => ({
  borderRadius: "0.75rem",
  objectFit: "cover",
  boxShadow: theme.shadows[2],
}));

const CardContainer = styled(Grid)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  transition: "transform 0.3s, box-shadow 0.3s",
  position: "relative",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: theme.shadows[6],
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  fontSize: "0.875rem",
  textTransform: "none",
  padding: theme.spacing(1),
}));

const CloseButton = styled(Button)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(1),
  right: theme.spacing(1),
  border: "1px solid #7B2281",
  color: "primary",
  "&:hover": {
    color: "white",
    backgroundColor: "#7B2281",
  },
}));

const MotorCompanies = () => {
  const dispatch = useDispatch();
  const [allData, setAllData] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const initRef = useRef();
  const { loginUserData: user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  // Get Motor company list API handler
  const getCompaniesNameList = () => {
    setIsLoading(true);
    if (initRef.current) {
      return;
    }
    initRef.current = true;

    dispatch(getAllCarCompanies({ key: "motor", search: "" }))
      .unwrap()
      .then((res) => {
        setIsLoading(false);
        setAllData(res);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load companies.");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getCompaniesNameList();
  }, []);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpenModal(true);
  };

  // Delete compnay handler
  const handleDelete = () => {
    setIsLoading(true);
    if (deleteId) {
      dispatch(deleteCompanyById(deleteId))
        .unwrap()
        .then(() => {
          setAllData((prevData) => prevData.filter((company) => company._id !== deleteId));
          toast.success("Company deleted successfully!");
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error deleting company:", err);
          toast.error("Error deleting company. Please try again.");
          setIsLoading(false);
        })
        .finally(() => {
          setOpenModal(false);
          setDeleteId(null);
        });
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setDeleteId(null);
  };

  return (
    <>
      {isLoading && <AnimationLoader open={true} />}
      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth={false}>
          <Stack direction="row" justifyContent="space-between" spacing={4} mb={3}>
            <Stack spacing={1}>
              <Typography variant="h4" color="textPrimary">
                Portals
              </Typography>
            </Stack>
            {moduleAccess(user, "companies.create") && (
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <NextLink href={`/motor-companies/create`} passHref>
                  <Button
                    startIcon={
                      <SvgIcon fontSize="small">
                        <PlusIcon />
                      </SvgIcon>
                    }
                    variant="contained"
                    color="primary"
                  >
                    Add
                  </Button>
                </NextLink>
              </Box>
            )}
          </Stack>
          <Grid
            container
            spacing={3}
            mt={3}
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            }}
          >
            {allData.map((company, index) => (
              <CardContainer
                key={company._id}
                item
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                sx={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <Img
                  alt={`${company.companyName} logo`}
                  src={baseURL + "/" + (company?.logoImg?.path || "/assets/products/product-1.png")}
                  height={110}
                  width={110}
                />
                <Typography variant="h6" sx={{ textAlign: "center", mt: 2, mb: 1 }}>
                  {company.companyName}
                </Typography>
                {/* Only delete portal compnaies form here!! */}
                {hoveredIndex === index && company?.showPortal === true && (
                  <CloseButton onClick={() => handleDeleteClick(company?._id)}>
                    <SvgIcon fontSize="small">
                      <DeleteIcon />
                    </SvgIcon>
                  </CloseButton>
                )}
                <Stack direction="row" spacing={1} mt={1}>
                  {moduleAccess(user, "companies.update") && (
                    <NextLink href={`/motor-companies/${company._id}/edit`} passHref>
                      <ActionButton
                        startIcon={
                          <SvgIcon fontSize="small">
                            <EditIcon />
                          </SvgIcon>
                        }
                        variant="outlined"
                        color="primary"
                      >
                        Edit
                      </ActionButton>
                    </NextLink>
                  )}
                  <ActionButton
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ExternalLinkIcon />
                      </SvgIcon>
                    }
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      if (company.companyPortal) {
                        window.open(company.companyPortal, "_blank");
                      } else {
                        toast.error("Company portal not found");
                      }
                    }}
                  >
                    Go to Portal
                  </ActionButton>
                </Stack>
              </CardContainer>
            ))}
          </Grid>
        </Container>

        {/* Confirmation Modal */}
        <ModalComp open={openModal} handleClose={handleCloseModal}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure you want to delete this portal?
          </Typography>
          <Box
            sx={{
              display: "flex",
            }}
            mt={3}
          >
            <Button
              variant="contained"
              sx={{
                marginRight: "10px",
              }}
              onClick={handleDelete}
            >
              Yes
            </Button>
            <Button variant="outlined" onClick={handleCloseModal}>
              Cancel
            </Button>
          </Box>
        </ModalComp>
      </Box>
    </>
  );
};

MotorCompanies.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default MotorCompanies;
