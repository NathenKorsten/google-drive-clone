import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDom from "react-dom";
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { storage, database } from "../../firebase";
import { ROOT_FOLDER } from "../hooks/useFolder";
import { v4 as uuidv4 } from "uuid";
import { ProgressBar, Toast } from "react-bootstrap";

export default function AddFileButton({ currentFolder }) {
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const { currentUser } = useAuth();
  var progress;
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (currentFolder == null || file == null) return;
    const id = uuidv4();
    setUploadingFiles((previousUploadingFiles) => [
      ...previousUploadingFiles,
      { id: id, name: file.name, progress: 0, error: false },
    ]);
    const filePath =
      currentFolder === ROOT_FOLDER
        ? `${currentFolder.path.join("/")}/${file.name}`
        : `${currentFolder.path.join("/")}/${currentFolder.name}/${file.name}`;
    const uploadTask = storage
      .ref(`/files/${currentUser.uid}/${filePath}`)
      .put(file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        progress = snapshot.bytesTransferred / snapshot.totalBytes;
        setUploadingFiles((previousUploadingFiles) => {
          return previousUploadingFiles.map((uploadFile) => {
            if (uploadFile.id === id) {
              return { ...uploadFile, progress: progress };
            }
            return uploadFile;
          });
        });
      },
      () => {},
      () => {
        setUploadingFiles((previousUploadingFiles) => {
          return previousUploadingFiles.filter((uploadFile) => {
            return uploadFile.id !== id;
          });
        });
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          database.files.add({
            url: url,
            name: file.name,
            CreatedAt: database.getCurrentTimeStamp(),
            folderId: currentFolder.id,
            userId: currentUser.uid,
          });
        });
      }
    );
  };
  return (
    <>
      <label className="btn btn-outline-success btn-sm m-0 mr-2">
        <FontAwesomeIcon icon={faFileUpload} size="3x" />
        <input
          type="file"
          onChange={handleUpload}
          style={{ opacity: 0, position: "absolute", left: "-9999px" }}
        />
        {uploadingFiles.length > 0 &&
          ReactDom.createPortal(
            <div
              style={{
                position: "absolute",
                bottom: "1rem",
                maxWidth: "250px",
              }}
            >
              {uploadingFiles.map((file) => (
                <Toast key={file.id}>
                  <Toast.Header className="text-truncate w-100 d-block">
                    {file.name}
                  </Toast.Header>
                  <Toast.Body>
                    <ProgressBar
                      animated={!file.error}
                      variant={file.error ? "danger" : "primary"}
                      now={file.erro ? 100 : file.progress * 100}
                      label={file.error ? "error" : `Uploading`}
                    />
                  </Toast.Body>
                </Toast>
              ))}
            </div>,
            document.body
          )}
      </label>
    </>
  );
}
