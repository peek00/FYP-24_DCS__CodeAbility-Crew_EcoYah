// React Imports
import { useState, useEffect, ChangeEvent } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

// MUI Imports
import { Grid, Box, Stack, TextField, InputAdornment } from "@mui/material";

// Icons
import AddIcon from "@mui/icons-material/Add";

// Components
import StaffTypography from "../Typography/StaffTypography";
import BoxButton from "../Button/BoxButton";
import FormDialog from "../Dialog/FormDialog";
import OutlinedTextField from "../TextFields/OutlinedTextField";
import BasicSelect from "../Select/Select";

// Utils Imports
import {
  createItem,
  getItemsByEventTypeName,
} from "../../services/itemApi";
import {
  formatAndCapitalizeString,
  isValueExistsInObjectArray,
} from "../../utils/Common";
import { Item } from "../../utils/Types";

type Step2FormProps = {
  validate: boolean;
  data: (key: string, value: any) => void;
  nextData: any;
  back: boolean;
  prevData: any;
};

export default function Step2Form(props: Step2FormProps) {
  // === For Item View and Create ===
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<Item[] | null>(
    Array.isArray(props.prevData["selectedItems"])
    ? props.prevData["selectedItems"]
    : null
  );
  const [selectedItemsInfo, setSelectedItemsInfo] = useState(
    Array.isArray(props.prevData["donationEventItems"])
    ? props.prevData["donationEventItems"]
    : []
    ); // REFACTOR: maybe don't need this, can add the extra attributes into selectedItems
  const [errorMessage, setErrorMessage] = useState<string>("");
  const eventTypeName = props.nextData.name;

  const menuItems = [
    { label: "Kilogram", value: "kilogram" },
    { label: "Litre", value: "litre" },
    { label: "Dollar", value: "dollar" },
    { label: "Hour", value: "hour" },
    { label: "Unit", value: "unit" },
  ];
  const [selectMenuItems, setSelectedMenuItems] = useState<string>("");

  const {
    data: itemsData,
    isLoading: itemsIsLoading,
    refetch: itemsRefetch,
  } = useQuery({
    queryKey: ["items", { eventTypeName: eventTypeName }],
    queryFn: () => getItemsByEventTypeName(eventTypeName),
  });

  useEffect(() => {
    if (!itemsIsLoading && itemsData) {
        const updatedItems = itemsData.data.items;
        setItems(updatedItems);

        if (selectedItems) {
            const checkSubset = selectedItems.every(
                selectedItem => updatedItems.some((item: Item) => item.id === selectedItem.id)
            );
            if (checkSubset) {
                // console.log('Partial array is a subset of full array');
            } else {
                // console.log('Partial array is not a subset of full array');
                setSelectedItems(null);
                setSelectedItemsInfo([]);
            }
        }
    }
  }, [itemsData, itemsIsLoading, selectedItems]);

  const handleItemBoxButtonClick = (item: Item) => {
    if (selectedItems?.some(selectedItem => selectedItem.id === item.id)) {
      // If the item is already in the array, remove it
      setSelectedItems(
        selectedItems.filter((selectedItem) => selectedItem.id !== item.id)
      );
      setSelectedItemsInfo(selectedItemsInfo.filter((selectedItemInfo: Item) => selectedItemInfo.id !== item.id));
    } else {
      // If the item is not in the array, add it
      setSelectedItems((prevSelectedItems: Item[] | null) => {
        const newSelectedItems = prevSelectedItems ? [...prevSelectedItems, item] : [item];
        setSelectedItemsInfo((prevSelectedItemsInfo: any) => [
          ...prevSelectedItemsInfo,
          {
            id: item.id, 
            name: item.name,
            unit: item.unit,
            minQty: "",
            targetQty: "",
            pointsPerUnit: "",
          },
        ]);
        return newSelectedItems;
      });
    };
  }

  const { mutateAsync: createItemMutateAsync } = useMutation({
    mutationKey: ["createItem"],
    // mutationFn: Performing the actual API call
    mutationFn: ({
      name,
      unit,
      eventTypeName,
    }: {
      name: string;
      unit: string;
      eventTypeName: string;
    }) => {
      return createItem(name, unit, eventTypeName);
    },
    // Execution after successful API call
    onSuccess: (response) => {
      if (response && response.data.item) {
        itemsRefetch();
        return true;
      }
      return false;
    },
    onError: (error: any) => {
      console.error("Error creating item: ", error);
      setErrorMessage("An error occurred while creating the item.");
    },
  });

  const handleItemFormSubmit = async (formData: any): Promise<boolean> => {
    setErrorMessage("");
    const { item, unit } = formData;
    const sanitisedItem = formatAndCapitalizeString(item); // Sanitize input to safeguard duplicate creation of event type
    const existingItems = itemsData.data.items;
    const isItemExists = isValueExistsInObjectArray(
      existingItems,
      "name",
      sanitisedItem
    );

    if (item === "" && unit === "") {
        setErrorMessage("Please enter an item and choose a unit");
        return false;
    }

    if (isItemExists) {
      setErrorMessage("This item already exists!");
      return false;
    }
    return createItemMutateAsync({
      name: sanitisedItem,
      unit: unit,
      eventTypeName: eventTypeName,
    });
  };
  // === For Item View and Create ===

  const itemFields = ["Minimum Quantity", "Target Quantity", "Points Per "];
  const itemKeys = ["minQty", "targetQty", "pointsPerUnit"];

  const handleTextChange =
    (itemKey: string, index: number) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setSelectedItemsInfo((prevData: any) => {
        const updatedItemsInfo = [...prevData];
        updatedItemsInfo[index] = {
          ...updatedItemsInfo[index],
          [itemKey]: parseFloat(event.target.value),
        };
        return updatedItemsInfo;
      });
    };

  useEffect(() => {
    // check that each value is neither empty nor NaN, then update the state
    if (
        selectedItemsInfo.every((item: { [s: string]: any }) =>
        Object.values(item).every(
          (value) => value !== "" && !Number.isNaN(value)
        )
      )
    ) {
      props.data("selectedItems", selectedItems);
      props.data("donationEventItems", selectedItemsInfo);
    } else {
      props.data("donationEventItems", []);
    }
  }, [selectedItemsInfo]);

  return (
    <>
      <Box display="flex" alignItems="center">
        <StaffTypography
          type="title"
          size={1.5}
          text={`4. Choose items under ${eventTypeName}`}
          customStyles={{ marginRight: 4 }}
        />
        <FormDialog
          buttonName="Add"
          buttonIcon={<AddIcon />}
          dialogTitle="Create a New Item"
          leftActionButtonName="Cancel"
          rightActionButtonName="Add"
          errorMessage={errorMessage}
          formComponent={
            <div>
              <OutlinedTextField
                id={"create-item"}
                name="item"
                label="Item"
                helperText="Please enter non-numerical values"
                regExpression={/^[a-zA-Z\s]+$/}
              />
              <BasicSelect
                name="unit"
                labelId="select-item-label"
                label="Unit"
                selectId="select-item-id"
                menuItems={menuItems}
                selectValue={selectMenuItems}
                onChange={setSelectedMenuItems}
              />
            </div>
          }
          handleFormSubmit={handleItemFormSubmit}
        ></FormDialog>
      </Box>
      {itemsIsLoading ? (
        <div>Loading Items</div>
      ) : (
        <Grid container>
            { items &&
            items.map((item: any) => (
            <Grid item xs={12} md={4} key={item.id}>
                <BoxButton
                    key={item.id}
                    handleClick={() => handleItemBoxButtonClick(item)}
                    color="primary"
                    size="small"
                    name={item.name}
                    isSelected={selectedItems ? selectedItems.some(selectedItem => selectedItem.id === item.id) : false}
                ></BoxButton>
            </Grid>
            )) }
        </Grid>
      )}
      {props.validate && selectedItems === null && (
        <StaffTypography
          type="helperText"
          size={1.5}
          text="Please choose at least 1 item"
        />
      )}
      <StaffTypography
        type="title"
        size={1.5}
        text="5. Fill up the information for each donation item"
      />
      <Grid container justifyContent="space-between" sx={{ p: 2 }}>
        {selectedItems && selectedItems.map(function (item, i) {
          return (
            <Grid
              item
              xs={12}
              md={12}
              lg={6}
              sx={{ marginBottom: "1rem" }}
              key={i}
            >
              <Box
                component="form"
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{
                  width: 400,
                  m: "auto",
                  "& > :not(style)": { m: "1rem", p: "1rem" },
                  boxShadow: 5,
                  borderRadius: 2,
                }}
                noValidate
                autoComplete="off"
              >
                <Stack spacing={5}>
                  <StaffTypography
                    type="title"
                    size={1.5}
                    text={"Item " + (i + 1) + ": " + item.name}
                  />
                  {itemFields.map(function (field, j) {
                    return (
                      <TextField
                        key={j}
                        label={
                          j !== 2
                            ? itemFields[j]
                            : itemFields[j] + item.unit
                        }
                        type="number"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {j !== 2 && item.unit}
                            </InputAdornment>
                          ),
                        }}
                        InputLabelProps={{ shrink: true }}
                        sx={{ width: 350 }}
                        value={
                          selectedItemsInfo[i] && selectedItemsInfo[i][itemKeys[j]]
                            ? selectedItemsInfo[i][itemKeys[j]]
                            : ""
                        }
                        onChange={handleTextChange(itemKeys[j], i)}
                        error={
                          (props.validate && !selectedItemsInfo[i]) ||
                          (props.validate &&
                            selectedItemsInfo[i] &&
                            !selectedItemsInfo[i][itemKeys[j]])
                        }
                        helperText={
                          ((props.validate && !selectedItemsInfo[i]) ||
                            (props.validate &&
                                selectedItemsInfo[i] &&
                              !selectedItemsInfo[i][itemKeys[j]])) && (
                            <StaffTypography
                              type="helperText"
                              size={1.5}
                              text="Please enter a number"
                            />
                          )
                        }
                      />
                    );
                  })}
                </Stack>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}