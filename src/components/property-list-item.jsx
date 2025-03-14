// This is common component for list item

import PropTypes from "prop-types";
import { Box, Chip, ListItem, ListItemText, Typography } from "@mui/material";

export const PropertyListItem = (props) => {
  const { align, children, disableGutters, value, label, spaceBetween, ...other } = props;

  return (
    <ListItem
      sx={{
        px: disableGutters ? 0 : 3,
        py: 1.5,
      }}
      {...other}
    >
      <ListItemText
        disableTypography
        primary={
          <Typography
            sx={{ minWidth: align === "vertical" ? "inherit" : spaceBetween ? spaceBetween : 180 }}
            variant="subtitle2"
          >
            {label}
          </Typography>
        }
        secondary={
          <Box
            sx={{
              flex: 1,
              mt: align === "vertical" ? 0.5 : 0,
            }}
          >
            {children || (
              <Typography color="textSecondary" variant="body2">
                <Box sx={{display:"flex", flexWrap: "wrap", gap: 1}}>
                  {Array.isArray(value)
                    ? (value || []).map((v) => {
                        if (typeof v === "string") {
                          return (
                            <Chip
                              key={v}
                              size="small"
                              variant="outlined"
                              label={v}
                            />
                          );
                        }
                      })
                    : value
                    ? value
                    : "-"}{" "}
                </Box>
              </Typography>
            )}
          </Box>
        }
        sx={{
          display: "flex",
          flexDirection: align === "vertical" ? "column" : "row",
          my: 0,
        }}
      />
    </ListItem>
  );
};

PropertyListItem.defaultProps = {
  align: "vertical",
};

PropertyListItem.propTypes = {
  align: PropTypes.oneOf[("horizontal", "vertical")],
  children: PropTypes.node,
  disableGutters: PropTypes.bool,
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
};
