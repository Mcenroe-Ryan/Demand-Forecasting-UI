import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "./utils/api";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
  ListItemText,
  List,
  ListItem,
  CircularProgress,
  Dialog,
  Slide,
} from "@mui/material";
import {
  ChevronRight as ChevronRightIcon,
  ChatBubbleOutline,
  Edit,
  MoreVert,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { format, addMonths, subMonths } from "date-fns";
import DateFilter from "./components/DateFilter";
import ModelComparisonSection from "./components/RecommendedModelsSection";
import ForecastTable from "./components/ForecastTable";
import { ChartSection } from "./components/ChartSection";
import { AlertProvider } from "./components/AlertContext";
import Chart from "./components/Messaging";
import ChatBot from "./components/Chatbox";
import { AnalyticsFrameSection } from "./components/AnalyticsFrameSection";
import ScenarioSection from "./components/ScenarioSection";
import AppHeader from "./components/AppHeader";

function getSelectedNames(selectedIds, options, optionKey, displayKey) {
  return options
    .filter((opt) => selectedIds.includes(opt[optionKey]))
    .map((opt) => opt[displayKey]);
}

const Listbox = () => {
  const listItems = [{ id: 1, label: "Product Name" }];
  const [checked, setChecked] = useState([]);
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };
  return (
    <Box sx={{ bgcolor: "#EFF6FF", px: 0.5, py: 0.5, minWidth: 180 }}>
      <List disablePadding>
        {listItems.map((item) => (
          <ListItem
            key={item.id}
            disableGutters
            onClick={handleToggle(item.id)}
            sx={{
              px: 1.2,
              py: 0.5,
              mb: 0.5,
              borderRadius: 1,
              cursor: "pointer",
              "&:last-child": { mb: 0 },
            }}
          >
            <Checkbox
              checked={checked.indexOf(item.id) !== -1}
              tabIndex={-1}
              disableRipple
              sx={{
                p: 0,
                mr: 1.2,
                width: 22,
                height: 22,
                "& .MuiSvgIcon-root": {
                  fontSize: 20,
                  border: "2px solid #bcd0e5",
                  borderRadius: "4px",
                  color: "#fff",
                  background: "#fff",
                },
                "&.Mui-checked .MuiSvgIcon-root": {
                  color: "#0288d1",
                  background: "#fff",
                  border: "2px solid #0288d1",
                },
              }}
            />
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: 17,
                fontWeight: 400,
                color: "#232b3a",
                fontFamily: "Poppins, Helvetica, Arial, sans-serif",
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

const DATA_ROW_OPTIONS = [
  { key: "all", label: "All" },
  { key: "sales", label: "Sales" },
  { key: "promotion", label: "Promotion / Marketing" },
  { key: "inventory", label: "Inventory Level" },
  { key: "stockout", label: "Stock out days" },
  { key: "onhand", label: "On Hand" },
];

function MultiSelectWithCheckboxes({
  label,
  options = [],
  optionKey,
  displayKey,
  selected,
  setSelected,
  width = 155,
  searchPlaceholder = "",
  loading = false,
  disabled = false,
  onOpen,
  single = false,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [search, setSearch] = useState("");
  const searchInputRef = useRef(null);

  const safeOptions = Array.isArray(options) ? options : [];

  const filteredOptions = safeOptions.filter((option) => {
    if (!search) return true;
    const searchField = displayKey ? option[displayKey] : option[optionKey];
    return (
      typeof searchField === "string" &&
      searchField.toLowerCase().includes(search.toLowerCase())
    );
  });

  const isAllSelected =
    !single && safeOptions.length > 0 && selected.length === safeOptions.length;

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    if (onOpen) onOpen();
  };
  const handleClose = () => setAnchorEl(null);

  useEffect(() => {
    if (anchorEl && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100);
    }
  }, [anchorEl]);

  const handleSelectAll = () => {
    if (single) return;
    setSelected(isAllSelected ? [] : safeOptions.map((opt) => opt[optionKey]));
  };

  const handleToggle = (value) => {
    if (single) {
      if (selected.length === 0) {
        setSelected([value]);
      } else if (selected[0] === value) {
        setSelected([]);
      }
      return;
    }

    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const getButtonLabel = () => {
    if (selected.length === 0) return label;
    if (selected.length === 1) {
      const found = safeOptions.find((opt) => opt[optionKey] === selected[0]);
      return found?.[displayKey || optionKey] || label;
    }
    return `${selected.length} selected`;
  };

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        onClick={handleOpen}
        sx={{
          minWidth: 120,
          flexShrink: 0,
          whiteSpace: "nowrap",
          bgcolor: "common.white",
          borderColor: "#bdbdbd",
          fontWeight: 400,
          textTransform: "none",
          px: 1.5,
          transition: "all 0.2s ease",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          "& .MuiButton-endIcon": {
            marginLeft: 0,
            marginRight: 0,
          },
        }}
        disabled={disabled}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {getButtonLabel()}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
          {!single && selected.length > 0 && (
            <Chip
              label={selected.length}
              size="small"
              color="primary"
              sx={{ mr: 0.5, height: 20 }}
            />
          )}
          <KeyboardArrowDownIcon
            sx={{ width: 16, height: 16, color: "#757575" }}
          />
        </Box>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{ style: { width: 280 } }}
      >
        <Box sx={{ p: 1, display: "flex", alignItems: "center" }}>
          <TextField
            inputRef={searchInputRef}
            size="small"
            placeholder={searchPlaceholder || `Search ${label.toLowerCase()}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />
        </Box>
        {loading ? (
          <MenuItem disabled>
            <CircularProgress size={20} sx={{ mr: 1 }} /> Loading...
          </MenuItem>
        ) : filteredOptions.length > 0 ? (
          [
            !single && (
              <MenuItem onClick={handleSelectAll} key="all">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={selected.length > 0 && !isAllSelected}
                />
                <ListItemText primary="All" />
              </MenuItem>
            ),
            ...filteredOptions.map((option) => {
              const val = option[optionKey];
              const isSelected = selected.includes(val);
              const isInactive = single && selected.length === 1 && !isSelected;

              return (
                <MenuItem
                  key={val}
                  onClick={() => handleToggle(val)}
                  dense
                  disabled={isInactive}
                  sx={{
                    opacity: isInactive ? 0.5 : 1,
                    cursor: isInactive ? "not-allowed" : "pointer",
                  }}
                >
                  <Checkbox checked={isSelected} disabled={isInactive} />
                  <ListItemText primary={option[displayKey || optionKey]} />
                </MenuItem>
              );
            }),
          ].filter(Boolean)
        ) : (
          <MenuItem disabled>
            <ListItemText primary="None" />
          </MenuItem>
        )}
      </Menu>
    </>
  );
}

const SlideTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export const DemandProjectMonth = () => {
  const navigate = useNavigate();
  const [alertCount, setAlertCount] = useState(null);
  const [alertCountLoading, setAlertCountLoading] = useState(true);
  const [dateFilterKey, setDateFilterKey] = useState(0);

  useEffect(() => {
    const fetchAlertCount = async () => {
      setAlertCountLoading(true);
      try {
        const count = await api.get("/getAlertCount");
        setAlertCount(count);
      } catch (error) {
        console.error("Error fetching alert count:", error);
        setAlertCount(null);
      } finally {
        setAlertCountLoading(false);
      }
    };

    fetchAlertCount();
  }, []);

  const tabs = [
    { label: "Demand", count: null },
    {
      label: "Alerts for Forecast Error",
      count: alertCountLoading ? "..." : alertCount,
    },
    { label: "Compare Model", count: null },
    { label: "Analytics", count: null },
    { label: "Scenarios", count: null },
  ];

  const scrollRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e) => {
    isDown.current = true;
    scrollRef.current.classList.add("dragging");
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
    scrollRef.current.classList.remove("dragging");
  };

  const handleMouseUp = () => {
    isDown.current = false;
    scrollRef.current.classList.remove("dragging");
  };

  const handleMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const [showActivities, setShowActivities] = useState(false);

  const [dateRange, setDateRange] = useState({
    startDate: format(subMonths(new Date("2024-12-01"), 6), "yyyy-MM-dd"),
    endDate: format(addMonths(new Date("2025-12-31"), 6), "yyyy-MM-dd"),
  });

  const [activeTab, setActiveTab] = useState(0);

  const [filtersData, setFiltersData] = useState({
    countries: [],
    states: [],
    cities: [],
    plants: [],
    categories: [],
    skus: [],
    channels: [],
  });

  const handleOpenActivities = () => setShowActivities(true);
  const handleCloseActivities = () => setShowActivities(false);

  const [selectedCountry, setSelectedCountry] = useState([]);
  const [selectedState, setSelectedState] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedPlants, setSelectedPlants] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSKUs, setSelectedSKUs] = useState([]);
  const [selectedChannels, setSelectedChannels] = useState([]);

  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingPlants, setLoadingPlants] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSkus, setLoadingSkus] = useState(false);
  const [loadingChannels, setLoadingChannels] = useState(false);
  const [models, setModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [modelName, setModelName] = useState("XGBoost");
  const [canEditConsensus, setCanEditConsensus] = useState(false);

  const [moreAnchorEl, setMoreAnchorEl] = useState(null);

  const handleMoreOpen = (event) => setMoreAnchorEl(event.currentTarget);
  const handleMoreClose = () => setMoreAnchorEl(null);

  const [isChatBotOpen, setIsChatBotOpen] = useState(false);

  const [highlightTrigger, setHighlightTrigger] = useState(0);

  const [compareLoading, setCompareLoading] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);
  const [scenariosLoading, setScenariosLoading] = useState(false);

  const handleEnableEditConsensus = () => {
    setCanEditConsensus(true);
    setHighlightTrigger(Date.now());
  };

  const handleOpenChatBot = () => {
    setIsChatBotOpen(true);
  };

  const handleCloseChatBot = () => {
    setIsChatBotOpen(false);
  };

  const fetchChannels = useCallback(async () => {
    setLoadingChannels(true);
    try {
      const data = await api.get("/getAllChannels?_=" + Date.now());
      setFiltersData((prev) => ({
        ...prev,
        channels: Array.isArray(data) ? data : [],
      }));
    } catch (error) {
      console.error("Error fetching channels:", error);
      setFiltersData((prev) => ({
        ...prev,
        channels: [],
      }));
    } finally {
      setLoadingChannels(false);
    }
  }, []);

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  const handleClearFilters = () => {
    setDateRange({
      startDate: format(subMonths(new Date("2024-12-01"), 6), "yyyy-MM-dd"),
      endDate: format(addMonths(new Date("2025-12-31"), 6), "yyyy-MM-dd"),
    });
    setSelectedCountry([]);
    setSelectedState([]);
    setSelectedCities([]);
    setSelectedPlants([]);
    setSelectedCategories([]);
    setSelectedSKUs([]);
    setSelectedChannels([]);

    setFiltersData((prev) => ({
      ...prev,
      countries: [],
      states: [],
      cities: [],
      plants: [],
      categories: [],
      skus: [],
      channels: [],
    }));

    setDateFilterKey((k) => k + 1);
    fetchChannels();
  };

  useEffect(() => {
    const fetchModels = async () => {
      setLoadingModels(true);
      try {
        const modelsData = await api.get("/models");
        setModels(modelsData);
        if (modelsData.length > 0) {
          const defaultModel =
            modelsData.find((m) => m.model_name === "XGBoost") ||
            modelsData[0];
          setModelName(defaultModel.model_name);
        }
      } catch (error) {
        console.error("Error fetching models:", error);
      } finally {
        setLoadingModels(false);
      }
    };

    fetchModels();
  }, []);

  const fetchCountries = async () => {
    setLoadingCountries(true);
    try {
      const data = await api.get("/getAllCountries");
      setFiltersData((prev) => ({
        ...prev,
        countries: Array.isArray(data) ? data : [],
      }));
    } catch (error) {
      console.error("Error fetching countries:", error);
      setFiltersData((prev) => ({
        ...prev,
        countries: [],
      }));
    } finally {
      setLoadingCountries(false);
    }
  };

  useEffect(() => {
    if (!selectedCountry.length) {
      setFiltersData((prev) => ({
        ...prev,
        states: [],
        cities: [],
        plants: [],
        categories: [],
        skus: [],
      }));
      setSelectedState([]);
      setSelectedCities([]);
      setSelectedPlants([]);
      setSelectedCategories([]);
      setSelectedSKUs([]);
      return;
    }

    const fetchStates = async () => {
      setLoadingStates(true);
      try {
        const data = await api.post("/states-by-country", {
          countryIds: selectedCountry,
        });
        setFiltersData((prev) => ({
          ...prev,
          states: Array.isArray(data) ? data : [],
          cities: [],
          plants: [],
          categories: [],
          skus: [],
        }));
        setSelectedState([]);
        setSelectedCities([]);
        setSelectedPlants([]);
        setSelectedCategories([]);
        setSelectedSKUs([]);
      } catch (error) {
        console.error("Error fetching states:", error);
        setFiltersData((prev) => ({
          ...prev,
          states: [],
          cities: [],
          plants: [],
          categories: [],
          skus: [],
        }));
        setSelectedState([]);
        setSelectedCities([]);
        setSelectedPlants([]);
        setSelectedCategories([]);
        setSelectedSKUs([]);
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, [selectedCountry]);

  useEffect(() => {
    if (!selectedState.length) {
      setFiltersData((prev) => ({
        ...prev,
        cities: [],
        plants: [],
        categories: [],
        skus: [],
      }));
      setSelectedCities([]);
      setSelectedPlants([]);
      setSelectedCategories([]);
      setSelectedSKUs([]);
      return;
    }

    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const data = await api.post("/cities-by-states", {
          stateIds: selectedState,
        });
        setFiltersData((prev) => ({
          ...prev,
          cities: Array.isArray(data) ? data : [],
          plants: [],
          categories: [],
          skus: [],
        }));
        setSelectedCities([]);
        setSelectedPlants([]);
        setSelectedCategories([]);
        setSelectedSKUs([]);
      } catch (error) {
        console.error("Error fetching cities:", error);
        setFiltersData((prev) => ({
          ...prev,
          cities: [],
          plants: [],
          categories: [],
          skus: [],
        }));
        setSelectedCities([]);
        setSelectedPlants([]);
        setSelectedCategories([]);
        setSelectedSKUs([]);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, [selectedState]);

  useEffect(() => {
    if (!selectedCities.length) {
      setFiltersData((prev) => ({
        ...prev,
        plants: [],
        categories: [],
        skus: [],
      }));
      setSelectedPlants([]);
      setSelectedCategories([]);
      setSelectedSKUs([]);
      return;
    }

    const fetchPlants = async () => {
      setLoadingPlants(true);
      try {
        const data = await api.post("/plants-by-cities", {
          cityIds: selectedCities,
        });
        setFiltersData((prev) => ({
          ...prev,
          plants: Array.isArray(data) ? data : [],
          categories: [],
          skus: [],
        }));
        setSelectedPlants([]);
        setSelectedCategories([]);
        setSelectedSKUs([]);
      } catch (error) {
        console.error("Error fetching plants:", error);
        setFiltersData((prev) => ({
          ...prev,
          plants: [],
          categories: [],
          skus: [],
        }));
        setSelectedPlants([]);
        setSelectedCategories([]);
        setSelectedSKUs([]);
      } finally {
        setLoadingPlants(false);
      }
    };

    fetchPlants();
  }, [selectedCities]);

  useEffect(() => {
    if (!selectedPlants.length) {
      setFiltersData((prev) => ({
        ...prev,
        categories: [],
        skus: [],
      }));
      setSelectedCategories([]);
      setSelectedSKUs([]);
      return;
    }

    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const data = await api.post("/categories-by-plants", {
          plantIds: selectedPlants,
        });
        setFiltersData((prev) => ({
          ...prev,
          categories: Array.isArray(data) ? data : [],
          skus: [],
        }));
        setSelectedCategories([]);
        setSelectedSKUs([]);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setFiltersData((prev) => ({
          ...prev,
          categories: [],
          skus: [],
        }));
        setSelectedCategories([]);
        setSelectedSKUs([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [selectedPlants]);

  useEffect(() => {
    if (!selectedCategories.length) {
      setFiltersData((prev) => ({
        ...prev,
        skus: [],
      }));
      setSelectedSKUs([]);
      return;
    }

    const fetchSKUs = async () => {
      setLoadingSkus(true);
      try {
        const data = await api.post("/skus-by-categories", {
          categoryIds: selectedCategories,
        });
        setFiltersData((prev) => ({
          ...prev,
          skus: Array.isArray(data) ? data : [],
        }));
        setSelectedSKUs([]);
      } catch (error) {
        console.error("Error fetching SKUs:", error);
        setFiltersData((prev) => ({
          ...prev,
          skus: [],
        }));
        setSelectedSKUs([]);
      } finally {
        setLoadingSkus(false);
      }
    };

    fetchSKUs();
  }, [selectedCategories]);

  useEffect(() => {
    setSelectedChannels([]);
  }, [selectedSKUs]);

  return (
    <Box>
           <AppHeader
        breadcrumbs={[
          { label: "M Project 1" },
          { label: "Demand" }
        ]}
      />

      <Box
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "start",
          bgcolor: "#64748B",
          p: 1.25,
          gap: 2,
          overflowX: "auto",
          overflowY: "hidden",
          cursor: "grab",
          userSelect: "none",
          WebkitOverflowScrolling: "touch",
          "&.dragging": {
            cursor: "grabbing",
          },
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <IconButton
          size="small"
          onClick={() => navigate("/dashboard")}
          aria-label="Back to Dashboard"
        >
          <img
            src="https://c.animaapp.com/Jwk7dHU9/img/union.svg"
            alt="Back"
            style={{ width: 20, height: 20 }}
          />
        </IconButton>
        <Divider orientation="vertical" flexItem sx={{ bgcolor: "grey.500" }} />

        <Box display="flex" alignItems="center" gap={2}>
          <Box
            position="relative"
            width={24}
            height={20}
            onClick={handleOpenActivities}
            sx={{ cursor: "pointer" }}
          >
            <ChatBubbleOutline sx={{ width: 20, height: 20, color: "white" }} />
            <Box
              component="img"
              src="https://c.animaapp.com/Jwk7dHU9/img/ellipse-309--stroke-.svg"
              alt="Indicator"
              sx={{
                position: "absolute",
                width: 12,
                height: 12,
                top: 0,
                left: 12,
                pointerEvents: "none",
              }}
            />
          </Box>

          <IconButton
            size="small"
            disableRipple
            sx={{ p: 0 }}
            onClick={handleOpenChatBot}
            aria-label="Open ChatBot"
          >
            <i
              className="bi bi-robot"
              style={{
                fontSize: 20,
                color: "#ffffff",
                transition: "all 0.2s ease",
              }}
            />
          </IconButton>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ bgcolor: "grey.500" }}
          />
        </Box>

        <Stack direction="row" spacing={1}>
          <DateFilter
            key={dateFilterKey}
            onDateChange={(range) => setDateRange(range)}
            disabled={
              activeTab === 1 ||
              activeTab === 2 ||
              activeTab === 3 ||
              activeTab === 4
            }
          />

          <MultiSelectWithCheckboxes
            label="Country"
            options={filtersData.countries}
            optionKey="country_id"
            displayKey="country_name"
            selected={selectedCountry}
            setSelected={setSelectedCountry}
            searchPlaceholder="Search country"
            loading={loadingCountries}
            onOpen={fetchCountries}
            width={110}
            single
            disabled={
              activeTab === 1 ||
              activeTab === 2 ||
              activeTab === 3 ||
              activeTab === 4
            }
          />

          <MultiSelectWithCheckboxes
            label="State"
            options={filtersData.states}
            optionKey="state_id"
            displayKey="state_name"
            selected={selectedState}
            setSelected={setSelectedState}
            searchPlaceholder="Search state"
            loading={loadingStates}
            disabled={
              selectedCountry.length === 0 ||
              activeTab === 1 ||
              activeTab === 2 ||
              activeTab === 3 ||
              activeTab === 4
            }
            width={110}
          />

          <MultiSelectWithCheckboxes
            label="City"
            options={filtersData.cities}
            optionKey="city_id"
            displayKey="city_name"
            selected={selectedCities}
            setSelected={setSelectedCities}
            searchPlaceholder="Search city"
            loading={loadingCities}
            disabled={
              selectedState.length === 0 ||
              activeTab === 1 ||
              activeTab === 2 ||
              activeTab === 3 ||
              activeTab === 4
            }
            width={110}
          />

          <MultiSelectWithCheckboxes
            label="Plant"
            options={filtersData.plants}
            optionKey="plant_id"
            displayKey="plant_name"
            selected={selectedPlants}
            setSelected={setSelectedPlants}
            searchPlaceholder="Search plant"
            loading={loadingPlants}
            disabled={
              selectedCities.length === 0 ||
              activeTab === 1 ||
              activeTab === 2 ||
              activeTab === 3 ||
              activeTab === 4
            }
            width={110}
          />

          <MultiSelectWithCheckboxes
            label="Category"
            options={filtersData.categories}
            optionKey="category_id"
            displayKey="category_name"
            selected={selectedCategories}
            setSelected={setSelectedCategories}
            searchPlaceholder="Search category"
            loading={loadingCategories}
            disabled={
              selectedPlants.length === 0 ||
              activeTab === 1 ||
              activeTab === 2 ||
              activeTab === 3 ||
              activeTab === 4
            }
            width={110}
          />

          <MultiSelectWithCheckboxes
            label="SKU"
            options={filtersData.skus}
            optionKey="sku_id"
            displayKey="sku_code"
            selected={selectedSKUs}
            setSelected={setSelectedSKUs}
            searchPlaceholder="Search SKU"
            loading={loadingSkus}
            disabled={
              selectedCategories.length === 0 ||
              activeTab === 1 ||
              activeTab === 2 ||
              activeTab === 3 ||
              activeTab === 4
            }
            width={110}
          />

          <MultiSelectWithCheckboxes
            label="Channel"
            options={filtersData.channels}
            optionKey="channel_id"
            displayKey="channel_name"
            selected={selectedChannels}
            setSelected={setSelectedChannels}
            searchPlaceholder="Search channel"
            loading={loadingChannels}
            width={110}
            disabled={
              selectedSKUs.length === 0 ||
              activeTab === 1 ||
              activeTab === 2 ||
              activeTab === 3 ||
              activeTab === 4
            }
          />

          <Button
            variant="outlined"
            size="small"
            onClick={handleClearFilters}
            sx={{
              minWidth: 100,
              flexShrink: 0,
              whiteSpace: "nowrap",
              bgcolor: "common.white",
              borderColor: "#bdbdbd",
              color: "#1976D2",
              fontWeight: 400,
              textTransform: "none",
              px: 1.5,
              transition: "all 0.2s ease",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              "&:hover": {
                borderColor: "#1976d2",
                bgcolor: "common.white",
              },
              "&:disabled": {
                bgcolor: "#f5f5f5",
                borderColor: "#e0e0e0",
                color: "#9e9e9e",
              },
            }}
            disabled={
              activeTab === 1 ||
              activeTab === 2 ||
              activeTab === 3 ||
              activeTab === 4
            }
          >
            Clear Filters
          </Button>

          <IconButton size="small" onClick={handleMoreOpen}>
            <MoreVert sx={{ width: 20, height: 20 }} />
          </IconButton>
          <Menu
            anchorEl={moreAnchorEl}
            open={Boolean(moreAnchorEl)}
            onClose={handleMoreClose}
            PaperProps={{
              style: {
                minWidth: 210,
                borderRadius: 8,
                boxShadow:
                  "0px 8px 24px rgba(29, 41, 57, 0.08), 0px 1.5px 4px rgba(0,0,0,0.04)",
                padding: 0,
              },
            }}
            MenuListProps={{
              sx: { p: 0 },
            }}
          >
            <Listbox />
          </Menu>
        </Stack>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => {
          setActiveTab(newValue);

          setDateRange({
            startDate: format(
              subMonths(new Date("2024-12-01"), 6),
              "yyyy-MM-dd"
            ),
            endDate: format(
              addMonths(new Date("2025-12-31"), 6),
              "yyyy-MM-dd"
            ),
          });

          if (
            newValue === 1 ||
            newValue === 2 ||
            newValue === 3 ||
            newValue === 4
          ) {
            setSelectedCountry([]);
            setSelectedState([]);
            setSelectedCities([]);
            setSelectedPlants([]);
            setSelectedCategories([]);
            setSelectedSKUs([]);
            setSelectedChannels([]);

            setFiltersData((prev) => ({
              ...prev,
              countries: [],
              states: [],
              cities: [],
              plants: [],
              categories: [],
              skus: [],
              channels: [],
            }));
          }

          if (newValue === 0) {
            fetchChannels();
          }

          if (newValue === 2) {
            setCompareLoading(true);
            setTimeout(() => setCompareLoading(false), 300);
          } else if (newValue === 3) {
            setAnalyticsLoading(true);
            setTimeout(() => setAnalyticsLoading(false), 300);
          } else if (newValue === 4) {
            setScenariosLoading(true);
            setTimeout(() => setScenariosLoading(false), 300);
          }
        }}
        sx={{
          borderBottom: 1,
          borderColor: "grey.200",
          bgcolor: "common.white",
          minHeight: 30,
        }}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography variant="body2" sx={{ color: "#545454" }}>
                  {tab.label}
                </Typography>
                {tab.count && (
                  <Chip label={tab.count} size="small" color="error" />
                )}
              </Box>
            }
            sx={{ minHeight: 30, px: 2.5, textTransform: "none" }}
          />
        ))}
      </Tabs>

      {activeTab < 2 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2.5,
            py: 0,
            bgcolor: "common.white",
            borderBottom: 1,
            borderColor: "grey.200",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}></Box>
        </Box>
      )}

      <Box sx={{ bgcolor: "#EFF6FF", minHeight: "100vh", py: 0 }}>
        <Box sx={{ flexGrow: 1, overflow: "auto" }}>
          {activeTab === 1 ? (
            chartLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "400px",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  bgcolor: "#f6faff",
                  p: 0,
                  m: 0,
                  lineHeight: 1,
                  minHeight: "auto",
                }}
              >
                <AlertProvider>
                  <div style={{ margin: 0, padding: 0 }}>
                    <ChartSection />
                  </div>
                </AlertProvider>
              </Box>
            )
          ) : activeTab === 2 ? (
            compareLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "400px",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  minHeight: 0,
                  bgcolor: "#e9f0f7",
                  p: 0,
                  m: 0,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <ModelComparisonSection />
              </Box>
            )
          ) : activeTab === 3 ? (
            analyticsLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "400px",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  minHeight: 0,
                  bgcolor: "#e9f0f7",
                  p: 0,
                  m: 0,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <AnalyticsFrameSection />
              </Box>
            )
          ) : activeTab === 4 ? (
            scenariosLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 400,
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ width: "100%", bgcolor: "#f6faff", p: 0, m: 0 }}>
                <ScenarioSection />
              </Box>
            )
          ) : (
            <>
              <ForecastTable
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                modelName={modelName}
                setModelName={setModelName}
                models={models}
                loadingModels={loadingModels}
                selectedCountry={getSelectedNames(
                  selectedCountry,
                  filtersData.countries,
                  "country_id",
                  "country_name"
                )}
                selectedState={getSelectedNames(
                  selectedState,
                  filtersData.states,
                  "state_id",
                  "state_name"
                )}
                selectedCities={getSelectedNames(
                  selectedCities,
                  filtersData.cities,
                  "city_id",
                  "city_name"
                )}
                selectedPlants={getSelectedNames(
                  selectedPlants,
                  filtersData.plants,
                  "plant_id",
                  "plant_name"
                )}
                selectedCategories={getSelectedNames(
                  selectedCategories,
                  filtersData.categories,
                  "category_id",
                  "category_name"
                )}
                selectedSKUs={getSelectedNames(
                  selectedSKUs,
                  filtersData.skus,
                  "sku_id",
                  "sku_code"
                )}
                selectedChannels={getSelectedNames(
                  selectedChannels,
                  filtersData.channels,
                  "channel_id",
                  "channel_name"
                )}
                canEditConsensus={canEditConsensus}
                setCanEditConsensus={setCanEditConsensus}
                highlightTrigger={highlightTrigger}
              />
            </>
          )}
        </Box>

        {showActivities && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              right: 0,
              height: "100vh",
              width: 700,
              zIndex: 1400,
              bgcolor: "rgba(0,0,0,0.18)",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-end",
            }}
            onClick={handleCloseActivities}
          >
            <Box
              sx={{
                height: "100vh",
                boxShadow: 6,
                bgcolor: "grey.400",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Chart onClose={handleCloseActivities} />
            </Box>
          </Box>
        )}

        <Dialog
          open={isChatBotOpen}
          onClose={handleCloseChatBot}
          TransitionComponent={SlideTransition}
          maxWidth={false}
          PaperProps={{
            sx: {
              margin: 0,
              maxWidth: "none",
              maxHeight: "none",
              borderRadius: "10px",
              overflow: "hidden",
              position: "fixed",
              right: 0,
              top: 0,
              height: "100vh",
            },
          }}
          sx={{
            "& .MuiDialog-container": {
              justifyContent: "flex-end",
            },
          }}
        >
          <ChatBot onClose={handleCloseChatBot} />
        </Dialog>
      </Box>
    </Box>
  );
};