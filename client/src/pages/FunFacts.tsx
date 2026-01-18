// src/pages/FunFacts.tsx
import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import Bart from "../components/Menut";

// Top-right icons (match screenshot vibe)
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

// Search icon
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

type Category =
  | "All"
  | "Places"
  | "Culture"
  | "History"
  | "Food"
  | "Urban legends"
  | "Random";

type Fact = {
  id: string;
  category: Exclude<Category, "All">;
  title: string;
  text: string;
  learnMoreHref?: string;
};

const FunFacts = (): React.ReactElement => {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [search, setSearch] = useState("");

  const facts: Fact[] = [
    {
      id: "places-1",
      category: "Places",
      title: "Places Fact #1",
      text: "Did you know that Japan has a rabbit island? It’s called Ookunoshima and it’s located near Hiroshima prefecture.",
    },
    {
      id: "places-2",
      category: "Places",
      title: "Places Fact #2",
      text: "Did you know that Tokyo is written as the “east capital” because it’s to the East of the previous capital, Kyoto.",
    },
    {
      id: "places-3",
      category: "Places",
      title: "Places Fact #3",
      text: "Did you know that Nagasaki has a lot of western influence? This was the only port city open to foreigners (the Dutch) during the isolation period.",
    },
    {
      id: "culture-1",
      category: "Culture",
      title: "Culture Fact #1",
      text: "Did you know that Dorodango means mud ball? It’s very shiny and fun to make!",
    },
    {
      id: "culture-2",
      category: "Culture",
      title: "Culture Fact #2",
      text: "Did you know most people celebrate Christmas by going to church, celebrate New Year’s Eve by going to a Buddhist temple, and celebrate New Year’s by going to a Shinto Shrine.",
    },
    {
      id: "history-1",
      category: "History",
      title: "History Fact #1",
      text: "Did you know that the world’s still-operating company is Japan’s? It’s a construction company called Kongo-gumi.",
    },
    // Optional filler categories (keep them even if empty so UI matches)
    {
      id: "food-1",
      category: "Food",
      title: "Food Fact #1",
      text: "Did you know ramen varies heavily by region in Japan, from miso-rich Hokkaido styles to tonkotsu in Kyushu.",
    },
    {
      id: "urban-1",
      category: "Urban legends",
      title: "Urban Legends Fact #1",
      text: "Did you know many Japanese towns have local yokai stories tied to specific bridges, shrines, and forests.",
    },
    {
      id: "random-1",
      category: "Random",
      title: "Random Fact #1",
      text: "Did you know some train stations play unique melodies to help commuters recognize stops more easily.",
    },
  ];

  const categories: Category[] = [
    "All",
    "Places",
    "Culture",
    "History",
    "Food",
    "Urban legends",
    "Random",
  ];

  const filteredFacts = useMemo(() => {
    const q = search.trim().toLowerCase();

    return facts.filter((f) => {
      const categoryOk = activeCategory === "All" ? true : f.category === activeCategory;
      const searchOk =
        q.length === 0
          ? true
          : `${f.title} ${f.text} ${f.category}`.toLowerCase().includes(q);

      return categoryOk && searchOk;
    });
  }, [activeCategory, search]);

  const handleReset = () => {
    setActiveCategory("All");
    setSearch("");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        // dotted grid background like screenshot
        backgroundColor: "#dee2e4",
        backgroundImage:
          "radial-gradient(rgba(0,0,0,0.15) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
        paddingBottom: "60px",
        pt: "6px",
      }}
    >
      {/* Left menu */}
      <Box sx={{ position: "absolute", top: 20, left: 20, zIndex: 10 }}>
        <Bart />
      </Box>

      {/* Top-right icons */}
      <Box
        sx={{
          position: "absolute",
          top: 14,
          right: 14,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          zIndex: 10,
        }}
      >
        <IconButton
          aria-label="Home"
          size="small"
          sx={{ color: "#b4441d" }}
          onClick={() => {}}
        >
          <HomeRoundedIcon />
        </IconButton>

        <IconButton
          aria-label="Achievements"
          size="small"
          sx={{ color: "#b4441d" }}
          onClick={() => {}}
        >
          <EmojiEventsRoundedIcon />
        </IconButton>

        <IconButton
          aria-label="Profile"
          size="small"
          sx={{ color: "#000" }}
          onClick={() => {}}
        >
          <PersonRoundedIcon />
        </IconButton>
      </Box>

      {/* Fun fact of the day card */}
      <Box
        sx={{
          width: "min(920px, 92vw)",
          mx: "auto",
          mt: "70px",
          bgcolor: "#b4441d",
          color: "#dee2e4",
          borderRadius: "32px",
          px: { xs: 3, sm: 6 },
          py: { xs: 3, sm: 4 },
          boxShadow: "0 10px 26px rgba(0,0,0,0.25)",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, mb: 1, textAlign: "center" }}
        >
          Fun Fact of the Day:
        </Typography>

        <Typography
          variant="body1"
          sx={{ fontSize: "14px", lineHeight: 1.5, opacity: 0.95 }}
        >
          During Japan’s self-isolation period (sakoku), there was an island called
          Dejima (it’s still there and has been restored if you’d like to visit!) in
          Nagasaki prefecture that was open to Dutch trade. The Dutch were Japan’s
          only main trading partners because they weren’t focused on spreading
          Christianity (unlike other European visitors). So, the Nagasaki area has a
          lot of European influence! If you ever go there now, there are lots of
          churches and stained glass windows in public buildings as well.
        </Typography>

        <Typography
          component="a"
          href="#"
          sx={{
            display: "inline-block",
            mt: 1.5,
            color: "#dee2e4",
            textDecoration: "underline",
            fontSize: "14px",
          }}
        >
          Learn more
        </Typography>
      </Box>

      {/* Section header row: All | Categories + Search + Reset */}
      <Box
        sx={{
          width: "min(980px, 92vw)",
          mx: "auto",
          mt: "26px",
        }}
      >
        {/* Row 1 */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "260px 1fr" },
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* Left: All / Categories */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              onClick={() => setActiveCategory("All")}
              disableRipple
              sx={{
                textTransform: "none",
                color: "#000",
                fontWeight: 800,
                background: "transparent",
                p: 0,
                minWidth: "unset",
                "&:hover": { background: "transparent" },
              }}
            >
              All
            </Button>

            <Box sx={{ width: "1px", height: "26px", bgcolor: "rgba(0,0,0,0.35)" }} />

            <Button
              disableRipple
              onClick={() => {}}
              sx={{
                textTransform: "none",
                color: "#000",
                fontWeight: 800,
                background: "transparent",
                p: 0,
                minWidth: "unset",
                borderBottom: "2px solid #000", // underline like screenshot
                borderRadius: 0,
                "&:hover": { background: "transparent" },
              }}
            >
              Categories
            </Button>
          </Box>

          {/* Right: Search + Reset */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              justifyContent: { xs: "flex-start", md: "flex-end" },
            }}
          >
            <TextField
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              variant="standard"
              sx={{
                width: { xs: "240px", sm: "320px" },
                "& .MuiInput-underline:before": {
                  borderBottomColor: "rgba(0,0,0,0.3)",
                },
                "& .MuiInput-underline:hover:before": {
                  borderBottomColor: "rgba(0,0,0,0.6)",
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchRoundedIcon sx={{ color: "#b4441d" }} />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              onClick={handleReset}
              sx={{
                textTransform: "none",
                bgcolor: "#92a6ba",
                color: "#000",
                borderRadius: "999px",
                px: 3,
                py: 0.8,
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                "&:hover": { bgcolor: "#7a92a8" },
              }}
            >
              Reset
            </Button>
          </Box>
        </Box>

        {/* Row 2: Category chips */}
        <Box
          sx={{
            mt: 2,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexWrap: "wrap",
            borderTop: "1px solid rgba(0,0,0,0.25)",
            pt: 2,
          }}
        >
          {categories.slice(1).map((cat) => (
            <Button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              disableRipple
              sx={{
                textTransform: "none",
                color: "#000",
                fontWeight: 700,
                background: "transparent",
                p: 0,
                minWidth: "unset",
                borderBottom:
                  activeCategory === cat ? "2px solid #000" : "2px solid transparent",
                borderRadius: 0,
                "&:hover": { background: "transparent" },
              }}
            >
              {cat}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Cards grid */}
      <Box
        sx={{
          width: "min(980px, 92vw)",
          mx: "auto",
          mt: 3,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(3, minmax(0, 1fr))",
          },
          gap: "18px",
        }}
      >
        {filteredFacts.map((fact) => (
          <Box
            key={fact.id}
            sx={{
              bgcolor: "#d9d9d9",
              borderRadius: "18px",
              p: 2.5,
              minHeight: "170px",
              boxShadow: "0px 6px 14px rgba(0,0,0,0.18)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: 800, mb: 1 }}>{fact.title}</Typography>
              <Typography sx={{ fontSize: "13px", lineHeight: 1.45 }}>
                {fact.text}
              </Typography>
            </Box>

            <Typography
              component="a"
              href={fact.learnMoreHref ?? "#"}
              sx={{
                mt: 2,
                fontSize: "13px",
                color: "#000",
                textDecoration: "underline",
                width: "fit-content",
              }}
            >
              Learn more
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default FunFacts;
