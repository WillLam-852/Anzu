import React, { useEffect, useState } from "react";
import { Stack, Typography } from "@mui/material";

import AlertDialog from "./AlertDialog";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Linkify from "react-linkify";
import TextField from "@mui/material/TextField";
import getSignedRequest from "../getSignedRequest";
import http from "../http-common";
import { styled } from "@mui/material/styles";

const Input = styled("input")({
  display: "none",
});

const Card = ({ card_data, edit_mode = undefined }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isNewCard, setIsNewCard] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isImageDeleted, setIsImageDeleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [card, setCard] = useState(undefined);
  const [editingTitle, setEditingTitle] = useState(undefined);
  const [editingDescription, setEditingDescription] = useState(undefined);
  const [currentImageFile, setCurrentImageFile] = useState(undefined);
  const [previewImage, setPreviewImage] = useState(undefined);

  useEffect(() => {
    setCard(card_data);
    if (!card_data.card_id) {
      setIsNewCard(true);
    }
  }, [card_data]);

  const handleEditAction = () => {
    if (card) {
      setEditingTitle(card.title);
      setEditingDescription(card.description);
      if (card.image) {
        setIsImageDeleted(false);
      } else {
        setIsImageDeleted(true);
      }
    }
    setIsEditing(true);
  };

  ///// API-related Functions /////

  const handleConfirmAction = async () => {
    try {
      if (currentImageFile) {
        setIsLoading(true);
        await getSignedRequest(currentImageFile, update_card);
      } else {
        await update_card(isImageDeleted ? null : undefined);
      }
    } catch (err) {
      setIsLoading(false);
      isNewCard
        ? alert(`新增資料失敗 (${err.message})`)
        : alert(`更改資料失敗 (${err.message})`);
    }
  };

  const update_card = async (image_url) => {
    const new_card = {
      page_id: card.page_id,
      card_id: card.card_id,
      title: editingTitle,
      image: image_url,
      description: editingDescription,
    };
    try {
      const res = isNewCard
        ? await http.post("/add_card", new_card)
        : await http.post("/edit_card", new_card);
      if (res.data.success) {
        window.location.reload(true);
      }
    } catch (err) {
      throw err;
    }
  };

  const handleCancelAction = () => {
    setIsEditing(false);
  };

  const handleDeleteAction = async () => {
    try {
      const res = await http.post("/delete_card", {
        page_id: card.page_id,
        card_id: card.card_id,
      });
      if (res.data.success) {
        setCard({ page_id: card.page_id });
        setIsEditing(false);
        setIsDeleted(true);
      } else {
        alert(`新增資料失敗 (${res.data.error})`);
      }
    } catch (err) {
      alert(`新增資料失敗 (${err.message})`);
    }
  };

  ///// Image-related Functions /////

  const show_image = () => {
    if (isImageDeleted) {
      return null;
    }
    if (previewImage) {
      return <img style={sxs.img} src={previewImage} alt="" />;
    } else {
      return <img style={sxs.img} src={card.image} alt="" />;
    }
  };

  const select_image = (e) => {
    if (e.target.files.length !== 0) {
      setCurrentImageFile(e.target.files[0]);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
      setIsImageDeleted(false);
    }
  };

  const remove_selected_image = () => {
    setCurrentImageFile(undefined);
    setPreviewImage(undefined);
    setIsImageDeleted(true);
  };

  ///// View-related Functions /////

  const show_edit_view = () => (
    <Box sx={sxs.card}>
      <Box sx={sxs.box}>
        <TextField
          sx={{ width: 400, maxWidth: "100%" }}
          label="標題 (可留空，按Enter鍵去下一行)"
          multiline
          value={editingTitle}
          onChange={(e) => setEditingTitle(e.target.value)}
          variant="outlined"
        />
      </Box>
      {show_image()}
      <Stack sx={sxs.box} spacing={2} direction="row">
        <label htmlFor="card_image">
          <Input
            accept="image/*"
            id="card_image"
            type="file"
            name="image"
            onChange={select_image}
          />
          <Button variant="outlined" component="span">
            {previewImage || card.image ? "更改照片" : "選擇照片"}
          </Button>
        </label>
        {previewImage || card.image ? (
          <Button
            variant="outlined"
            component="span"
            color="warning"
            onClick={remove_selected_image}
          >
            刪除照片
          </Button>
        ) : null}
      </Stack>
      <Box sx={sxs.box}>
        <TextField
          style={{ width: 600, maxWidth: "100%" }}
          label="文字 (可留空，按Enter鍵去下一行)"
          multiline
          value={editingDescription}
          onChange={(e) => setEditingDescription(e.target.value)}
          variant="outlined"
        />
      </Box>

      <Stack sx={sxs.box} spacing={2} direction="row">
        <Button variant="contained" onClick={handleConfirmAction}>
          確定
        </Button>
        <Button variant="outlined" onClick={handleCancelAction}>
          取消
        </Button>
        {!isNewCard ? (
          <AlertDialog
            title="刪除"
            variant="contained"
            color="warning"
            onClick={handleDeleteAction}
          />
        ) : null}
      </Stack>
      {isLoading ? (
        <Box sx={sxs.box}>
          <CircularProgress />
        </Box>
      ) : null}
    </Box>
  );

  const show_normal_view = () => {
    return (
      <Box sx={sxs.card}>
        {card && card.title ? (
          <Typography sx={sxs.paragraph} variant="h4">
            {card.title}
          </Typography>
        ) : null}
        {card && card.image ? (
          <img style={sxs.img} src={card.image} alt="" />
        ) : null}
        {card && card.description ? (
          <Typography sx={sxs.paragraph}>
            <Linkify>{card.description}</Linkify>
          </Typography>
        ) : null}
        <Box sx={sxs.box}>
          {edit_mode ? (
            <Button variant="outlined" onClick={handleEditAction}>
              {edit_mode}
            </Button>
          ) : null}
        </Box>
      </Box>
    );
  };

  return isDeleted ? null : isEditing ? show_edit_view() : show_normal_view();
};

const sxs = {
  card: {
    pb: 5,
  },
  box: {
    pb: 2,
  },
  paragraph: {
    pb: 2,
    whiteSpace: "pre-wrap",
  },
  img: {
    maxWidth: "100%",
    maxHeight: 400,
    paddingBottom: 10,
  },
};

export default Card;
