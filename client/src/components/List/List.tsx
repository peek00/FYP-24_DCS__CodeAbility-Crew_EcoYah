// React Imports
import { useState } from "react";

// MUI Imports
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Box,
  Divider,
} from "@mui/material";

// Components
import StaffTypography from "../Typography/StaffTypography";
import BasicButton from "../Button/BasicButton";
import BasicModal from "../Modal/BasicModal";

// Other Imports
import { DonationRequestType } from "../../utils/Types";

type ItemListType = {
  data: DonationRequestType[];
  onRemoveRequest: (id: number) => void;
};

export default function ItemList(props: ItemListType) {
  const [openModals, setOpenModals] = useState<Array<boolean>>(
    Array(props.data.length).fill(false),
  );

  const handleButtonChange = (index: number, status: boolean) => {
    const newOpenModals = [...openModals];
    newOpenModals[index] = status;
    setOpenModals(newOpenModals);
  };

  return (
    <>
      {props.data.map(function (eachData: DonationRequestType, index: number) {
        return (
          <List key={index} sx={{ width: "100%", bgcolor: "background.paper" }}>
            <ListItem alignItems="center">
              <ListItemAvatar>
                <Avatar
                  alt={eachData.user.name}
                  src="/static/images/avatar/1.jpg"
                  sx={{ width: "5rem", height: "5rem", marginRight: "1rem" }}
                />
              </ListItemAvatar>
              <ListItemText>
                <StaffTypography
                  size={1.5}
                  text={eachData.user.name}
                  type={"title"}
                  customStyles={{ color: "secondary.main", fontWeight: "none" }}
                />
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <StaffTypography
                    size={1.25}
                    text={`Drop off on <br> ${new Date(eachData.dropOffDate).toLocaleDateString("en-GB")}, ${eachData.dropOffTime}`}
                    type={"title"}
                    customStyles={{
                      color: "secondary.dark",
                      fontWeight: "none",
                    }}
                  />
                  <BasicButton
                    variant="contained"
                    label={"View More"}
                    customStyles={{
                      fontSize: "1rem",
                      letterSpacing: "0.12rem",
                      width: "9.375rem",
                      height: "3.75rem",
                      backgroundColor: "primary.dark",
                    }}
                    onButtonChange={(status: boolean) =>
                      handleButtonChange(index, status)
                    }
                  />
                </Box>
              </ListItemText>
              <BasicModal
                open={openModals[index]}
                data={eachData}
                onModalChange={(status: boolean) =>
                  handleButtonChange(index, status)
                }
                onRemoveRequest={props.onRemoveRequest}
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </List>
        );
      })}
    </>
  );
}
