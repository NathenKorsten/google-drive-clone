import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { faFolder } from "@fortawesome/free-solid-svg-icons";

export default function Folder({ folder }) {
  return (
    <Button
      as={Link}
      to={{
        pathname: `/folder/${folder.id}`,
        state: { folder: folder },
      }}
      variant="outline-dark"
      className="tet-truncate w-100"
    >
      <FontAwesomeIcon icon={faFolder} className="mr-2" size="2x" />
      {folder.name}
    </Button>
  );
}
