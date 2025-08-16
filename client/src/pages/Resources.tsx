import React, { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import Bart from '../components/Menut'; // ✅ Your hamburger menu

const Resources = (): React.ReactElement => {
  const categories: Record<string, string[]> = {
    News: ['NHK', 'Ohayo Nihon', 'Asahi', 'NHK News Web Easy', 'Places'],
    Textbooks: ['Genki', 'Japanese for Busy People', 'Random'],
    Videos: ['NHK for School', 'Youtube channel', 'Doraemon', 'Some youtube'],
    Shows: ['Some anime', 'Gegege no Kitaro', 'Doraemon', 'Some youtube'],
    Organizations: ['Japan Society of Northern California', 'Culture', 'Random'],
    Writing: ['Exercise sheets', 'More practice', 'Exercise 3'],
    Podcasts: ['Example 1', 'Example 2', 'Example 3'],
    Reading: ['Ame nimo makezu', 'Book 2', 'Poem 3'],
  };

  const [q, setQ] = useState('');
  const [cat, setCat] = useState<'All' | string>('All');

  const styles = {
    body: {
      textAlign: 'center' as const,
      backgroundColor: '#dee2e4',
      minHeight: '100vh',
      paddingBottom: '50px',
      position: 'relative' as const,
    },
    menu: {
      display: 'flex',
      flexDirection: 'column' as const,
      marginTop: '30px',
    },
    row: {
      display: 'flex',
      flexDirection: 'row' as const,
      justifyContent: 'center',
      flexWrap: 'wrap' as const,
    },
    box: {
      height: '15vw',
      width: '250px',
      borderRadius: '7px',
      backgroundColor: '#989191',
      marginTop: '20px',
      margin: '30px',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      color: '#000',
    },
    topBar: {
      width: '100%',
      maxWidth: 980,
      margin: '20px auto 0',
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      px: 2,
    },
  };

  const categoryNames = useMemo(
    () => ['All', ...Object.keys(categories)],
    [categories]
  );

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    const sourceEntries =
      cat === 'All'
        ? Object.entries(categories)
        : Object.entries(categories).filter(([name]) => name === cat);

    const result: Array<[string, string[]]> = sourceEntries
      .map<[string, string[]]>(([section, items]) => {
        if (!ql) return [section, items];
        const match = items.filter((it) => it.toLowerCase().includes(ql));
        return [section, match];
      })
      .filter(([, items]) => items.length > 0);

    return result;
  }, [q, cat, categories]);

  const hasResults = filtered.length > 0;

  return (
    <Box sx={styles.body}>
      <Box sx={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
        <Bart />
      </Box>

      <Typography variant="h3" sx={{ paddingTop: '30px' }}>
        Resources
      </Typography>

      {/* One-liner: Search + Category filter (side by side) */}
      <Box sx={styles.topBar as any}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search resources…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: q ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  aria-label="clear search"
                  onClick={() => setQ('')}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />
        <Select
          size="small"
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          sx={{ minWidth: 180, bgcolor: 'white' }}
        >
          {categoryNames.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box sx={styles.menu}>
        {hasResults ? (
          filtered.map(([section, items]) => (
            <React.Fragment key={section}>
              <Typography variant="h5" sx={{ marginTop: '40px' }}>
                {section}
              </Typography>
              <Box sx={styles.row}>
                {items.map((item, idx) => (
                  <Button key={`${section}-${idx}`} sx={styles.box}>
                    {item}
                  </Button>
                ))}
              </Box>
            </React.Fragment>
          ))
        ) : (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h6" color="text.secondary">
              No results found.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try a different search or category.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Resources;
