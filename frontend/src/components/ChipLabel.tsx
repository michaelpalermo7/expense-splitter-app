import React from "react";
import Chip from "@mui/material/Chip";

interface ChipLabelProps {
  label: string;
}

const ChipLabel: React.FC<ChipLabelProps> = ({ label }) => {
  return (
    <Chip
      label={label}
      variant="outlined"
      sx={{
        borderColor: "#000000",
        color: "#000",
        backgroundColor: "transparent",
        borderWidth: "1px",
        borderRadius: "16px",
        fontWeight: 600,
        padding: "4px 0",

        // no hover effects
        "&:hover": {
          backgroundColor: "transparent",
          color: "#000",
        },
      }}
    />
  );
};

export default ChipLabel;
