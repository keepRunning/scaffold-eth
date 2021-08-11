import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="#XXX" target="_blank" rel="noopener noreferrer">
      <PageHeader
        title="BBS"
        subTitle="Bulletin Block System"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
