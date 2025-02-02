import React from 'react';
import { Box, Container, Typography, List, ListItem, ListItemText, Link } from '@mui/material';

const resources = [
  {
    name: 'JapanesePod101',
    description: 'Extensive resource with podcast-style lessons from beginner to advanced levels.',
    url: 'https://www.japanesepod101.com/',
  },
  {
    name: 'Tofugu',
    description: 'Comprehensive guides and articles on learning Japanese language and culture.',
    url: 'https://www.tofugu.com/learn-japanese/',
  },
  {
    name: 'Tae Kim’s Guide to Learning Japanese',
    description: 'A free and detailed guide covering essential Japanese grammar.',
    url: 'http://www.guidetojapanese.org/learn/',
  },
  {
    name: 'WaniKani',
    description: 'A web application that helps you learn kanji and vocabulary using spaced repetition.',
    url: 'https://www.wanikani.com/',
  },
  {
    name: 'Bunpro',
    description: 'A comprehensive grammar study tool that uses SRS to help you master Japanese grammar.',
    url: 'https://www.bunpro.jp/',
  },
];

const Resources: React.FC = () => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Box flexGrow={1} sx={{ py: 5, px: 3 }}>
        <Container maxWidth="md">
        <Typography variant="h3" textAlign="center" gutterBottom>
               Resources
             </Typography>
             <Typography variant="h6" textAlign="center" color="textSecondary" mb={4}>
               日本語を学ぶための最高の無料＆有料リソースを集めました！
             </Typography>

             <List>
               {resources.map((resource, index) => (
                 <ListItem key={index} sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                   <ListItemText
                     primary={
                       <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
                         <Link href={resource.url} target="_blank" rel="noopener noreferrer" underline="hover">
                           {resource.name}
                         </Link>
                       </Typography>
                     }
                     secondary={
                       <Typography variant="body2" color="textSecondary">
                         {resource.description}
                       </Typography>
                     }
                   />
                 </ListItem>
               ))}
             </List>
           </Container>
         </Box>
       </Box>
     );
   };

   export default Resources;
