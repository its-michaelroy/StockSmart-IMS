"use client";
import { firestore } from "@/firebase";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  return (
    <Box>
      <Typography variant="h1">Hello everyone!!</Typography>
    </Box>
  );
}
